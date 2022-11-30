import React from 'react';

const Navbar = () => {
  return (
    <nav className='nav'>
      <div className='container'>
        <img className='nav__logo' src='/logo.png' alt='logo' />
        <div className='nav__center__links'>
          <a href='/'>Differences</a>
          <a href='/'>Careers</a>
        </div>
        <div className='nav__search'>
          <span>Search</span>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M17.2767 15.4611L24.0064 22.1909L22.1909 24.0064L15.4611 17.2767C13.8444 18.5148 11.8172 19.2462 9.6231 19.2462C4.31115 19.2462 0 14.935 0 9.6231C0 4.31115 4.31115 0 9.6231 0C14.935 0 19.2462 4.31115 19.2462 9.6231C19.2462 11.8172 18.5084 13.838 17.2767 15.4611ZM9.6231 16.68C13.5237 16.68 16.68 13.5237 16.68 9.6231C16.68 5.72253 13.5237 2.56616 9.6231 2.56616C5.72253 2.56616 2.56616 5.72253 2.56616 9.6231C2.56616 13.5237 5.72253 16.68 9.6231 16.68Z'
              fill='white'
            />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
