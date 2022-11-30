import React, { useEffect, useLayoutEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imagesLoaded from 'imagesloaded';
import postvertex from './post_shader/vertex.glsl';
import postfragment from './post_shader/fragment.glsl';
import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// let OrbitControls = require('three-orbit-controls')(THREE);

const Webgl = () => {
  gsap.registerPlugin(ScrollTrigger);

  useLayoutEffect(() => {
    let docScroll;
    let IMAGES;
    const getPageYScroll = () =>
      (docScroll = window.pageYOffset || document.documentElement.scrollTop);
    window.addEventListener('scroll', getPageYScroll);
    const body = document.body;
    const createInputEvents = require('simple-input-events');

    const event = createInputEvents();
    let winsize;
    const calcWinsize = () =>
      (winsize = { width: window.innerWidth, height: window.innerHeight });
    calcWinsize();
    window.addEventListener('resize', calcWinsize);
    const MathUtils = {
      map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
      lerp: (a, b, n) => (1 - n) * a + n * b,
      clamp: (min, max) => (value) =>
        value < min ? min : value > max ? max : value,
    };

    const vertex = `
    uniform float time;
    uniform float progress;
    uniform vec4 resolution;
    varying vec2 vUv;
    uniform sampler2D texture1;
    
    const float pi = 3.1415925;
    
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
      // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
               
      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      // pos.z = 0.01 * sin(pos.x *pos.y  * 20. + time)  ;
      // float noiseFreq = 1.5;
      // float noiseAmp = 0.15; 
      // vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y, pos.z);
      // pos.z += snoise(noisePos) * noiseAmp;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
    }
    `;
    const fragment = `
    uniform float time;
    uniform float progress;
    uniform sampler2D texture1;
    uniform vec4 resolution;
    varying vec2 vUv;


    void main()	{
      vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
      // newUV.x += 0.02*sin(newUV.y*20. + time);
      gl_FragColor = texture2D(texture1,newUV);
    }`;

    const postVertext = `
    uniform float time;
    uniform float progress;
    uniform vec2 resolution;
    varying vec2 vUv;
    varying vec4 vPosition;
    uniform sampler2D texture1;
    const float pi = 3.1415925;
    
    
    
    
    void main() {
      vUv = uv;
      vec3 pos = position;
    
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
    }
    
    
    
    `;
    const postFragment = `
    uniform float time;
    uniform float progress;
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    varying vec2 vUv;
    uniform vec2 uMouse;
    uniform float uVelo;
    uniform int uType;
    
    
    float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
      uv -= disc_center;
      uv*=resolution;
      float dist = sqrt(dot(uv, uv));
      return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
    }
    
    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    
    float remap(float value, float inMin, float inMax, float outMin, float outMax) {
      return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    }
    
    float hash12(vec2 p) {
      float h = dot(p,vec2(127.1,311.7));	
      return fract(sin(h)*43758.5453123);
    }
    
    // #define HASHSCALE3 vec3(.1031, .1030, .0973)
    vec2 hash2d(vec2 p)
    {
      vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
      p3 += dot(p3, p3.yzx+19.19);
      return fract((p3.xx+p3.yz)*p3.zy);
    }
    
    
    void main()	{
      // vec4 color = vec4(1.,0.,0.,1.);
      
      // colorful
      if(uType==0){
      float c = circle(vUv, uMouse, 0.0, 0.1+uVelo*2.)*40.*uVelo;
        vec2 newUV = mix(vUv, uMouse, c); 
      float r = texture2D(tDiffuse, newUV.xy += c * (uVelo * .5)).x;
      float g = texture2D(tDiffuse, newUV.xy += c * (uVelo * .525)).y;
      float b = texture2D(tDiffuse, newUV.xy += c * (uVelo * .55)).z;
      vec2 offsetVector = normalize(uMouse - vUv);
      vec2 warpedUV = mix(newUV, uMouse, c * 0.99); 
        vec4 rgb = vec4(r, g, b, 1.);
      vec4 zoom = texture2D(tDiffuse,warpedUV) + texture2D(tDiffuse,warpedUV)*vec4(vec3(c),1.);
      
      gl_FragColor = zoom;
      gl_FragColor = rgb;
      }
    
    }
`;
    // Canvas Scene
    class Sketch {
      constructor(selector) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#fff');
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
        });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(this.width, this.height);
        this.renderer.sortObjects = false;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container = document.getElementById('webgl');
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
          70,
          window.innerWidth / window.innerHeight,
          100,
          1000
        );

        this.cameraDistance = 400;
        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.lookAt(0, 0, 0);
        this.time = 0;
        this.speed = 0;
        this.targetSpeed = 0;
        this.mouse = new THREE.Vector2();
        this.followMouse = new THREE.Vector2();
        this.prevMouse = new THREE.Vector2();

        this.paused = false;

        this.setupResize();
        this.composerPass();
        this.mouseMove();

        this.addObjects();
        this.resize();
        this.render();
      }

      mouseMove() {
        event.on('move', ({ position, event, inside, dragging }) => {
          // mousemove / touchmove
          this.mouse.x = position[0] / window.innerWidth;
          this.mouse.y = 1 - position[1] / window.innerHeight;
        });
      }

      setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
      }

      resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.camera.fov =
          2 *
          Math.atan(
            this.width / this.camera.aspect / (2 * this.cameraDistance)
          ) *
          (180 / Math.PI); // in degrees

        this.customPass.uniforms.resolution.value.y = this.height / this.width;

        this.camera.updateProjectionMatrix();
      }

      addObjects() {
        let that = this;
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 80, 80);
        this.material = new THREE.ShaderMaterial({
          extensions: {
            derivatives: '#extension GL_OES_standard_derivatives : enable',
          },
          side: THREE.DoubleSide,
          uniforms: {
            time: { type: 'f', value: 0 },
            progress: { type: 'f', value: 0 },
            angle: { type: 'f', value: 0 },
            texture1: { type: 't', value: null },
            texture2: { type: 't', value: null },
            resolution: { type: 'v4', value: new THREE.Vector4() },
            uvRate1: {
              value: new THREE.Vector2(1, 1),
            },
          },
          // wireframe: true,
          transparent: true,
          vertexShader: vertex,
          fragmentShader: fragment,
        });
      }

      createMesh(o) {
        let material = this.material.clone();
        let texture = new THREE.Texture(o.image);
        texture.needsUpdate = true;
        // image cover
        let imageAspect = o.iHeight / o.iWidth;
        let a1;
        let a2;
        if (o.height / o.width > imageAspect) {
          a1 = (o.width / o.height) * imageAspect;
          a2 = 1;
        } else {
          a1 = 1;
          a2 = o.height / o.width / imageAspect;
        }
        texture.minFilter = THREE.LinearFilter;
        material.uniforms.resolution.value.x = o.width;
        material.uniforms.resolution.value.y = o.height;
        material.uniforms.resolution.value.z = a1;
        material.uniforms.resolution.value.w = a2;
        material.uniforms.progress.value = 0;
        material.uniforms.angle.value = 0.3;

        material.uniforms.texture1.value = texture;
        material.uniforms.texture1.value.needsUpdate = true;

        let mesh = new THREE.Mesh(this.geometry, material);

        mesh.scale.set(o.width, o.height, o.width / 2);

        return mesh;
      }

      composerPass() {
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        //custom shader pass
        let counter = 0.0;
        let myEffect = {
          uniforms: {
            tDiffuse: { value: null },
            distort: { value: 0 },
            resolution: {
              value: new THREE.Vector2(
                1,
                window.innerHeight / window.innerWidth
              ),
            },
            uMouse: { value: new THREE.Vector2(-10, -10) },
            uVelo: { value: 0 },
            uScale: { value: 0 },
            uType: { value: 0 },
            time: { value: 0 },
          },
          vertexShader: postVertext,
          fragmentShader: postFragment,
        };

        this.customPass = new ShaderPass(myEffect);
        this.customPass.renderToScreen = true;
        this.composer.addPass(this.customPass);
      }

      stop() {
        this.paused = true;
      }

      play() {
        this.paused = false;
        this.render();
      }

      getSpeed() {
        this.speed = Math.sqrt(
          (this.prevMouse.x - this.mouse.x) ** 2 +
            (this.prevMouse.y - this.mouse.y) ** 2
        );

        this.targetSpeed -= 0.1 * (this.targetSpeed - this.speed);
        this.followMouse.x -= 0.1 * (this.followMouse.x - this.mouse.x);
        this.followMouse.y -= 0.1 * (this.followMouse.y - this.mouse.y);

        this.prevMouse.x = this.mouse.x;
        this.prevMouse.y = this.mouse.y;
      }

      render() {
        this.time += 0.05;
        this.getSpeed();
        this.scene.children.forEach((m) => {
          if (m.material.uniforms) {
            // m.material.uniforms.angle.value = this.settings.angle;
            m.material.uniforms.time.value = this.time;
          }
        });
        this.customPass.uniforms.time.value = this.time;
        this.customPass.uniforms.uMouse.value = this.followMouse;
        // this.customPass.uniforms.uVelo.value = this.settings.velo;
        this.customPass.uniforms.uVelo.value = Math.min(this.targetSpeed, 0.05);
        this.targetSpeed *= 0.999;
        // this.renderer.render(this.scene, this.camera);
        if (this.composer) this.composer.render();
      }
    }
    const scene = new Sketch();

    // Item
    class Item {
      constructor(el, scroll) {
        // the .item element
        this.scroll = scroll;
        this.DOM = { el: el.img };
        this.currentScroll = docScroll;
        this.animated = false;
        this.isBeingAnimatedNow = false;
        this.shouldRollBack = false;
        this.shouldUnRoll = false;
        this.positions = [];

        // set the initial values
        this.getSize();
        this.mesh = scene.createMesh({
          width: this.width,
          height: this.height,
          src: this.src,
          image: this.DOM.el,
          iWidth: this.DOM.el.width,
          iHeight: this.DOM.el.height,
        });
        scene.scene.add(this.mesh);
        // this.intersectionRatio();
        let options = {
          root: null,
          rootMargin: '0px',
          threshold: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        };
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            this.positions.push(entry.boundingClientRect.y);
            let compareArray = this.positions.slice(
              this.positions.length - 2,
              this.positions.length
            );
            let down = compareArray[0] > compareArray[1] ? true : false;

            this.isVisible = entry.intersectionRatio > 0.0;

            this.shouldRollBack = false;
            this.shouldUnRoll = false;
            if (
              entry.intersectionRatio < 0.5 &&
              entry.boundingClientRect.y > 0 &&
              this.isVisible &&
              !down
            ) {
              this.shouldRollBack = true;
            }

            if (
              entry.intersectionRatio > 0.5 &&
              entry.boundingClientRect.y > 0 &&
              this.isVisible
            ) {
              this.shouldUnRoll = true;
            }
            this.mesh.visible = this.isVisible;
          });
        }, options);
        this.observer.observe(this.DOM.el);
        window.addEventListener('resize', () => this.resize());
        this.render(0);
      }
      getSize() {
        // get all the sizes here, bounds and all
        const bounds = this.DOM.el.getBoundingClientRect();
        const fromTop = bounds.top;
        const windowHeight = window.innerHeight;
        const withoutHeight = fromTop - windowHeight;
        const withHeight = fromTop + bounds.height;
        this.insideTop = withoutHeight - docScroll;
        this.insideRealTop = fromTop + docScroll;
        this.insideBottom = withHeight - docScroll + 50;
        this.width = bounds.width;
        this.height = bounds.height;
        this.left = bounds.left;
      }
      resize() {
        // on resize rest sizes and update the translation value
        this.getSize();
        this.mesh.scale.set(this.width, this.height, 200);
        this.render(this.scroll.renderedStyles.translationY.current);
        this.scroll.shouldRender = true;
      }
      render(currentScroll) {
        this.currentScroll = currentScroll;
        this.mesh.position.y =
          currentScroll +
          winsize.height / 2 -
          this.insideRealTop -
          this.height / 2;
        this.mesh.position.x =
          0 - winsize.width / 2 + this.left + this.width / 2;
      }
    }

    // SmoothScroll
    class SmoothScroll {
      constructor() {
        this.shouldRender = false;
        this.DOM = { main: document.querySelector('main#scrollArea') };
        this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
        this.items = [];
        this.dimages = [];

        this.createItems();
        this.listenMouse();

        this.renderedStyles = {
          translationY: {
            previous: 0,
            current: 0,
            ease: 0.1,
            setValue: () => docScroll,
          },
        };

        this.setSize();
        this.update();
        this.style();
        this.initEvents();
        requestAnimationFrame(() => this.render());
      }

      createItems() {
        console.log(IMAGES);
        IMAGES.forEach((image) => {
          if (image.img.classList.contains('c-img')) {
            this.items.push(new Item(image, this));
          }
          if (image.img.classList.contains('d-img')) {
            this.dimages.push(new Item(image, this));
          }
        });
      }
      listenMouse() {
        document.addEventListener('mousemove', () => {
          this.shouldRender = true;
        });
      }
      setSize() {
        body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
      }

      update() {
        for (const key in this.renderedStyles) {
          this.renderedStyles[key].current = this.renderedStyles[key].previous =
            this.renderedStyles[key].setValue();
        }
        this.setPosition();
        this.shouldRender = true;
      }
      setPosition() {
        if (
          Math.round(this.renderedStyles.translationY.previous) !==
            Math.round(this.renderedStyles.translationY.current) ||
          this.renderedStyles.translationY.previous < 10
        ) {
          this.shouldRender = true;
          this.DOM.scrollable.style.transform = `translate3d(0,${
            -1 * this.renderedStyles.translationY.previous
          }px,0)`;

          // Render WEBGL IMAGES
          for (const item of this.items) {
            if (item.isVisible || item.isBeingAnimatedNow) {
              item.render(this.renderedStyles.translationY.previous);
            }
          }

          for (const item of this.dimages) {
            if (item.isVisible || item.isBeingAnimatedNow) {
              item.render(this.renderedStyles.translationY.previous);
            }
          }
        }
        if (scene.targetSpeed > 0.01) this.shouldRender = true;
        if (this.shouldRender) {
          this.shouldRender = false;
          scene.render();
        }
      }
      style() {
        this.DOM.main.style.position = 'fixed';
        this.DOM.main.style.width = this.DOM.main.style.height = '100%';
        this.DOM.main.style.top = this.DOM.main.style.left = 0;
        this.DOM.main.style.overflow = 'hidden';
      }
      initEvents() {
        window.addEventListener('resize', () => this.setSize());
      }
      render() {
        for (const key in this.renderedStyles) {
          this.renderedStyles[key].current =
            this.renderedStyles[key].setValue();
          this.renderedStyles[key].previous = MathUtils.lerp(
            this.renderedStyles[key].previous,
            this.renderedStyles[key].current,
            this.renderedStyles[key].ease
          );
        }
        this.setPosition();
        requestAnimationFrame(() => this.render());
      }
    }

    const preloadImages = new Promise((resolve, reject) => {
      imagesLoaded(
        document.querySelectorAll('img'),
        { background: true },
        resolve
      );
    });

    preloadImages.then((images) => {
      IMAGES = images.images;
    });
    const preloadEverything = [preloadImages];

    Promise.all(preloadEverything).then(() => {
      getPageYScroll();
      new SmoothScroll();
    });
  });
  return <></>;
};

export default Webgl;
