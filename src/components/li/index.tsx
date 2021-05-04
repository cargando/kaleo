import React, { useCallback } from 'react';

function Li({ onChange, value }) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLInputElement;
      let newVal: number = value;
      if (target.getAttribute('data-val') === 'up') {
        newVal++;
      } else {
        newVal--;
      }
      onChange(newVal);
    },
    [value],
  );

  return (
    <div>
      <p>{value}</p>
      <button data-val="up" onClick={handleClick}>
        up
      </button>
      <br />
      <button data-val="down" onClick={handleClick}>
        down
      </button>
    </div>
  );
}

export default Li;
