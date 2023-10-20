import Petname from './Petname';
import PurseValue from './PurseValue';
import Icons from '../util/Icons.js';

const PurseAmount = ({ brandPetname, pursePetname, value, displayInfo }) => {

  let iconName;
  if(!brandPetname) {
      iconName = 'defaultIcon';
  } else if(brandPetname.indexOf('USDC') >=0 ){
      iconName = 'USDC';
  }

  return (
    <div className="Amount">
      <img
        alt="icon"
        src={Icons[iconName ?? brandPetname]}
        height="32px"
        width="32px"
      />
      <div>
        <Petname name={pursePetname} />
        <PurseValue
          value={value}
          displayInfo={displayInfo}
          brandPetname={brandPetname}
        />
      </div>
    </div>
  );
};

export default PurseAmount;
