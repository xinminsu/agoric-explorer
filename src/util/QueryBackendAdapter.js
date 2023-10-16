import { E } from '@endo/eventual-send';
import { Far } from '@endo/marshal';
import {
  makeAsyncIterableFromNotifier,
  makeNotifierKit,
} from '@agoric/notifier';
import { iterateLatest } from '@agoric/casting';

const newId = kind => `${kind}${Math.random()}`;

export const makeBackendFromQueryBridge = queryBridge => {
  /**
   * @template T
   * @param {ERef<Notifier<T>>} notifier
   */
  const iterateNotifier = async notifier =>
    makeAsyncIterableFromNotifier(notifier)[Symbol.asyncIterator]();

  const { notifier: servicesNotifier } = makeNotifierKit(
    harden({
      board: E(queryBridge).getBoard(),
    }),
  );

  /**
   * @param {AsyncIterator<any[], any[], undefined>} offersMembers
   */
  const wrapOffersIterator = offersMembers =>
    harden({
      next: async () => {
        const { done, value } = await E(offersMembers).next();
        return harden({
          done,
          value:
            value &&
            value.map(({ id, ...rest }) =>
              harden({
                id,
                ...rest,
                actions: Far('offerActions', {
                  // Provide these synthetic actions since offers don't have any yet.
                  accept: () => E(queryBridge).acceptOffer(id),
                  decline: () => E(queryBridge).declineOffer(id),
                  cancel: () => E(queryBridge).cancelOffer(id),
                }),
              }),
            ),
        });
      },
      return: offersMembers.return,
      throw: offersMembers.throw,
    });

  const firstSchema = harden({
    actions: Far('schemaActions', {
      createPurse: (issuer, id = newId('Purse')) =>
        E(queryBridge).makeEmptyPurse(issuer?.issuerPetname, id),
      createContact: (depositFacet, id = newId('Contact')) =>
        E(queryBridge).addContact(id, depositFacet),
      createIssuer: (issuer, id = newId('Issuer')) =>
        E(queryBridge).addIssuer(id, issuer, true),
    }),
    services: iterateNotifier(servicesNotifier),
    contacts: iterateNotifier(E(queryBridge).getContactsNotifier()),
    dapps: iterateNotifier(E(queryBridge).getDappsNotifier()),
    issuers: iterateNotifier(E(queryBridge).getIssuersNotifier()),
    offers: wrapOffersIterator(
      iterateNotifier(E(queryBridge).getOffersNotifier()),
    ),
    payments: iterateNotifier(E(queryBridge).getPaymentsNotifier()),
    purses: iterateNotifier(E(queryBridge).getPursesNotifier()),
  });

  // Just produce a single update for the initial backend.
  // TODO: allow further updates.
  const { notifier: backendNotifier, updater: backendUpdater } =
    makeNotifierKit(firstSchema);

  const backendIt = iterateNotifier(backendNotifier);

  const cancel = e => {
    backendUpdater.fail(e);
  };

  return { backendIt, cancel };
};

/**
 * @param {import('@agoric/casting').Follower} follower
 * @param {(e: unknown) => void} [errorHandler]
 * @param {() => void} [firstCallback]
 */
export const makeQueryBridgeFromFollower = (
  follower,
  errorHandler = e => {
    // Make an unhandled rejection.
    throw e;
  },
  firstCallback,
) => {
  const notifiers = {
    getPursesNotifier: 'purses',
    getContactsNotifier: 'contacts',
    getDappsNotifier: 'dapps',
    getIssuersNotifier: 'issuers',
    getOffersNotifier: 'offers',
    getPaymentsNotifier: 'payments',
  };

  const notifierKits = Object.fromEntries(
    Object.entries(notifiers).map(([_method, stateName]) => [
      stateName,
      makeNotifierKit(null),
    ]),
  );

  const followLatest = async () => {
    for await (const { value: state } of iterateLatest(follower)) {
      if (firstCallback) {
        firstCallback();
        firstCallback = undefined;
      }
      Object.entries(notifierKits).forEach(([stateName, { updater }]) => {
        updater.updateState(state[stateName]);
      });
    }
  };
  followLatest().catch(errorHandler);
  const getNotifierMethods = Object.fromEntries(
    Object.entries(notifiers).map(([method, stateName]) => {
      const { notifier } = notifierKits[stateName];
      return [method, () => notifier];
    }),
  );
  const queryBridge = Far('follower query bridge', {
    ...getNotifierMethods,
  });
  return queryBridge;
};
