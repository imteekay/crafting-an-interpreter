import { Hello } from '../index';

describe('Hello', () => {
  it('returns the compiler hello', () => {
    expect(Hello()).toEqual('Hello from the compiler');
  });
});
