import { NavLink } from 'react-router-dom';
import InsightSlider from './components/InsightSlider';

function App() {
  return (
    <>
      <header>
        <img className='nav__logo' src='/logo.png' alt='logo' />
      </header>
      <section className='hero'>
        <div className='hero__left'>
          <div className='hero__left_content'>
            <h1>Going Beyond.</h1>
            <h2>Your partner in business</h2>
          </div>
        </div>
        <div className='hero__right'>
          <div className='hero__bg_image'>
            <div className='hero__bg_image_overlay'></div>
            <img src='/hero_bg.png' alt='hero' />
          </div>
          <div className='hero__right_content'>
            <nav className='hero__nav'>
              <ul>
                <li>
                  <NavLink to='/'>Differences</NavLink>
                </li>
                <li>
                  <NavLink to='/'>Careers</NavLink>
                </li>
              </ul>
              <div className='hero__nav_search'>
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
            </nav>

            <div className='hero__text'>
              <h1>
                Helping you navigate <br />
                the commerical <br /> landscape.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className='insight'>
        <div className='insight__content'>
          <div className='insight__content_left'>
            <img src='/hero_to.png' alt='hero_to' />
          </div>
          <div className='insight__content_right'>
            <div className='section-intro'>
              <h2>Insights</h2>
            </div>
            <div className='insight__slider'>
              <InsightSlider />
            </div>
          </div>
        </div>
      </section>

      <section className='expertise'>
        <div className='section-intro section-padding'>
          <h1>Explore our expertise.</h1>
        </div>
        <div className='expertise__content'>
          <div className='expertise__content_left'>
            <ul>
              <li>Agribusiness</li>
              <li>Banking and finance</li>
              <li>COMMERCIAL</li>
              <li>CONSTRUCTION AND PROJECTS</li>
              <li>SUPERANNUATION AND FUNDS</li>
              <li>CYBER, DATE AND IP</li>
              <li>Agribusiness</li>
              <li>PRIVATE GROUPS </li>
              <li>REGULATORY AND INVESTIGATIONS</li>
              <li>CONSTRUCTION AND PROJECTS</li>
              <li>SUPERANNUATION AND FUNDS</li>
              <li>CYBER, DATE AND IP</li>
              <li>Agribusiness</li>
              <li>PRIVATE GROUPS </li>
              <li>REGULATORY AND INVESTIGATIONS</li>
            </ul>
          </div>
          <div className='expertise__content_right'>
            <img src='experties.png' alt='expertise' />
          </div>
        </div>
      </section>

      <section className='team'>
        <div className='team__content'>
          <div className='team__content_left'>
            <img src='team.png' alt='team' />
          </div>
          <div className='team__content_right'>
            <h1>
              A team of dedicated people committed to advancing and protecting
              the interests of our clients.
            </h1>

            <p>
              Quisque malesuada placerat nisl. Vestibulum facilisis, purus nec
              pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna
              in dolor nam adipiscing es leor palas.
            </p>

            <button className='custom-link'>Meet our team</button>
          </div>
        </div>
      </section>

      <section className='enquiry'>
        <div className='enquiry__content'>
          <div className='enquiry__content_left'>
            <h1>Looking for expert advice?</h1>
          </div>
          <div className='enquiry__content_right'>
            <button className='custom-link'>Make an enquiry</button>
          </div>
        </div>
      </section>

      <footer className='footer'>
        <div className='footer__content'>
          <div className='footer__left'>
            <img className='nav__logo' src='/logo.png' alt='logo' />

            <img src='clients.png' alt='client' />
          </div>
          <div className='footer__right'>
            <div className='footer__right_items'>
              <div className='footer__item'>
                <h3 className='footer__title'>Contact</h3>
                <p>
                  Level 10, 81 Flinders Street Adelaide SA 5000 Tel +61 8 8210
                  2222 dmaw@dmawlawyers.com.au
                </p>
              </div>
              <div className='footer__item'>
                <h3 className='footer__title'>Connect</h3>

                <div className='footer__social'>
                  <img src='social.png' alt='social' />
                </div>
              </div>
            </div>
            <div className='site-meta'>
              &copy; Copyright 2022, All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
