import React from 'react';
import { shallow } from 'enzyme';

import Component from './index';

describe('Header', () => {
  it('renders without crashing', () => {
    shallow(<Component />);
  });
});
