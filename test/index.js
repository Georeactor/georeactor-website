import React from 'react';
import { mount, shallow } from 'enzyme';

describe('<Foo />', () => {

  it('calls componentDidMount', () => {
    const wrapper = mount(<Foo />);
    expect(Foo.prototype.componentDidMount.calledOnce).to.equal(true);
  });

});
