import React from 'react';

import './Image.css';

const image = props => (
  <div
    className="image"
    style={{
      backgroundImage: `url(${props.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: props.left ? 'left' : 'center'
    }}
  />
);

export default image;
