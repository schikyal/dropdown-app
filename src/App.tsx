import { useState } from 'react';
import Dropdown from './components/Dropdown';

type OptionProps = {
  label: string;
  value: string | number;
}

/*
  Example list for the dropdown menu
  Assumes unique values but the labels can be equivalent to each other
*/
const options = [
  {label: "First", value: 1},
  {label: "Second", value: 2},
  {label: "Third", value: 3},
  {label: "Fourth", value: 4},
  {label: "Fifth", value: 5},
]

/*
  Renders a multi-select dropdown list if multiple is set to true.
  Otherwise, a single select dropdown list will be rendered.
*/
function App() {

  const [multiValue, setMultiValue] = useState<OptionProps[]>([options[0]])
  const [value, setValue] = useState<OptionProps | undefined>(options[0])

  return (
    <div className="App">
      <Dropdown multiple={true} options={options} value={multiValue} onChange={option => setMultiValue(option)} />
      <br />
      <Dropdown options={options} value={value} onChange={option => setValue(option)} />
    </div>
  );
}

export default App;
