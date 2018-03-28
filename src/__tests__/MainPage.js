import React from 'react';
import LoaderView from '../client/LoaderView';
import Enzyme, {mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

describe('Main page', () => {
  it('Check page status', () => {
    const request = require('supertest');
    const b = request('http://localhost:3000')
    .get('/')
      .expect(200)
  });

  it('Empty current file', () => {
    const component = mount(<LoaderView />);
    const button = component.find('button');
    expect(component.state().file).toBe(null);
  });
}) 