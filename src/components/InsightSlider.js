import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper';
import { useSwiper } from 'swiper/react';

const InsightSlider = () => {
  const swiper = useSwiper();

  return (
    <>
      <div className='custom__slide_nav'>
        <span onClick={() => swiper.slidePrev()}>
          <svg
            width='62'
            height='11'
            viewBox='0 0 62 11'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <line x1='62' y1='5.5' x2='6' y2='5.5' stroke='#303188' />
            <path
              d='M7.75 9.39711L0.999999 5.5L7.75 1.60288L7.75 9.39711Z'
              fill='#303188'
              stroke='#303188'
            />
          </svg>
        </span>
        <span onClick={() => swiper.slideNext()}>
          <svg
            width='62'
            height='11'
            viewBox='0 0 62 11'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <line x1='62' y1='5.5' x2='6' y2='5.5' stroke='#303188' />
            <path
              d='M7.75 9.39711L0.999999 5.5L7.75 1.60288L7.75 9.39711Z'
              fill='#303188'
              stroke='#303188'
            />
          </svg>
        </span>
      </div>
      <Swiper
        spaceBetween={0}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        onSlideChange={() => console.log('slide change')}>
        <SwiperSlide>
          {({ isActive }) => (
            <div
              className={isActive ? 'custom__slide active' : 'custom__slide'}>
              <img src='/slide-1.png' alt='slide-1' />
              <h3>DMAW Lawyers, Bendigo Bank and Grant Thornton EOY Drinks</h3>
            </div>
          )}
        </SwiperSlide>
        <SwiperSlide>
          {({ isActive }) => (
            <div
              className={isActive ? 'custom__slide active' : 'custom__slide'}>
              <img src='/slide-1.png' alt='slide-1' />
              <h3>DMAW Lawyers, Bendigo Bank and Grant Thornton EOY Drinks</h3>
            </div>
          )}
        </SwiperSlide>
        <SwiperSlide>
          {({ isActive }) => (
            <div
              className={isActive ? 'custom__slide active' : 'custom__slide'}>
              <img src='/slide-1.png' alt='slide-1' />
              <h3>DMAW Lawyers, Bendigo Bank and Grant Thornton EOY Drinks</h3>
            </div>
          )}
        </SwiperSlide>
        <SwiperSlide>
          {({ isActive }) => (
            <div
              className={isActive ? 'custom__slide active' : 'custom__slide'}>
              <img src='/slide-1.png' alt='slide-1' />
              <h3>DMAW Lawyers, Bendigo Bank and Grant Thornton EOY Drinks</h3>
            </div>
          )}
        </SwiperSlide>
        ...
      </Swiper>
    </>
  );
};

export default InsightSlider;
