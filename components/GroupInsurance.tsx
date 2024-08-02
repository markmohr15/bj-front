import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { insureAllSpots, checkAndTriggerIntermediateActions,
         updateGroupInsurance } from '../lib/slices/blackjackSlice';

const GroupInsurance: React.FC<InsuranceProps> = ({ onComplete }) => {
  const dispatch = useDispatch();

  const handleInsurance = (insure: boolean) => {
    dispatch(insureAllSpots(insure)).then(() => {
      dispatch(checkAndTriggerIntermediateActions());
    });
  }

  const handleInsureIndividually = () => {
    dispatch(updateGroupInsurance());
  };

  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => handleInsurance(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-200"
      >
        Insure All
      </button>
      <button
        onClick={() => handleInsurance(false)}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
      >
        Insure None
      </button>
      <button
        onClick={handleInsureIndividually}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Insure Individually
      </button>
    </div>
  );
};

export default GroupInsurance;