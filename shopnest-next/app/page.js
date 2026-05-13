'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Topbar from '@/components/Topbar';
import CategoryNav from '@/components/CategoryNav';
import HeroBanner from '@/components/HeroBanner';
import OfferStrip from '@/components/OfferStrip';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import CartPanel from '@/components/CartPanel';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetail from '@/components/ProductDetail';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import UserAuthModal from '@/components/UserAuthModal';
import Toast from '@/components/Toast';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HomePage() {
  const container = useRef();

  useGSAP(() => {
    // Parallax Hero background & fade out cards with scale effect
    gsap.to('#hero', {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.deal-card', {
      y: 80,
      opacity: 0,
      scale: 0.9,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Offer strip horizontal slide-in with subtle rotation
    gsap.from('.offer-chip', {
      x: 80,
      opacity: 0,
      rotation: -5,
      stagger: 0.08,
      duration: 1,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '#offers',
        start: 'top 95%',
        toggleActions: 'play none none none'
      }
    });

    // Product grid staggered reveal with 3D-like scale and fade
    gsap.from('.product-card', {
      y: 60,
      opacity: 0,
      scale: 0.95,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#product-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // Animate filters sidebar sliding in
    gsap.from('#filters', {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#content',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }, { scope: container });

  return (
    <div ref={container}>
      <Topbar />
      <CategoryNav />
      <HeroBanner />
      <OfferStrip />
      <div id="content">
        <FilterSidebar />
        <ProductGrid />
      </div>
      <CartPanel />
      <CheckoutModal />
      <ProductDetail />
      <AdminPanel />
      <AdminLoginModal />
      <UserAuthModal />
      <Toast />
    </div>
  );
}
