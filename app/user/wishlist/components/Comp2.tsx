import Link from 'next/link';
import { createProductHref } from '@/app/data/products';

const productHref = (product: {
  id: number;
  name: string;
  price: number;
  collection: string;
  image: string;
  category: string;
}) => createProductHref(product);

export default function Comp2() {
  return (
    <>
      <main className="max-w-[1920px] mx-auto px-8 py-12">
        <section className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-6">
          <div>
            <h1 className="font-brand text-7xl md:text-9xl leading-none uppercase tracking-tighter">
              MY WISHLIST
            </h1>
            <p className="font-headline text-lg text-zinc-500 uppercase tracking-widest mt-2">
              Curated Selects / Season 04
            </p>
          </div>
          <div className="text-right">
            <span className="font-headline font-bold text-4xl">04</span>
            <span className="block font-label text-xs uppercase tracking-widest text-zinc-400">
              Items Stored
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 bg-surface-container-high border border-surface-container-high">
          <div className="bg-surface flex flex-col group relative">
            <Link href={productHref({ id: 201, name: 'V-12 Apex Shell', price: 345, collection: 'URBAN TECH / SHELL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5ihs_H2Q5i9M_QsBvBDkFq8Mkz4-WwzOCXDmNimkPh9AB2_QQX4KzKs6IiOb-VrJVKMc24cFJ297VDOWZCRW9HycKyPwCFtr0VDkJNJUTfrSAEgBt7X_SIo5I2TFemS_vSauGIVuMn1bUBwprWHW8swcx2dSmqupdkoRcfzG-gKWbps6V4JkUl5HCQa1eNYx1jnsda5Stq2UyVD0FhRKqVSFegoCMEJ1BXraOcPO0NihDzS_2SuNgDAvjQqDC57hgvlQPD0cF8FyW', category: 'Outerwear' })} className="absolute inset-0 z-10" aria-label="Open V-12 Apex Shell" />
            <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
              <img
                alt="Technical windbreaker jacket"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                data-alt="Technical streetwear windbreaker in matte black fabric with reflective details, professional studio lighting on grey background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ihs_H2Q5i9M_QsBvBDkFq8Mkz4-WwzOCXDmNimkPh9AB2_QQX4KzKs6IiOb-VrJVKMc24cFJ297VDOWZCRW9HycKyPwCFtr0VDkJNJUTfrSAEgBt7X_SIo5I2TFemS_vSauGIVuMn1bUBwprWHW8swcx2dSmqupdkoRcfzG-gKWbps6V4JkUl5HCQa1eNYx1jnsda5Stq2UyVD0FhRKqVSFegoCMEJ1BXraOcPO0NihDzS_2SuNgDAvjQqDC57hgvlQPD0cF8FyW"
              />
              <button className="absolute top-4 right-4 z-20 p-2 bg-surface hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                  V-12 Apex Shell
                </h3>
                <span className="font-brand text-2xl text-primary">$345</span>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button className="w-full bg-on-surface text-on-primary font-label font-bold py-4 px-6 uppercase tracking-widest hover:bg-primary active:scale-95 transition-all duration-200 relative z-20">
                  ADD TO CART
                </button>
                <button className="w-full border border-surface-container-high text-on-surface font-label font-bold py-3 px-6 uppercase tracking-widest hover:bg-surface-container-low transition-all duration-200 text-xs relative z-20">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface flex flex-col group relative">
            <Link href={productHref({ id: 202, name: 'KINETIC HEAVYWEIGHT', price: 180, collection: 'NOIR FLEECE / CORE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUp0llnS7w0VCmZHxn0GGwyMtP3G8DQAHOjvvGxiPqyEQUXfUhec1pld1W_DM2T3mUVmu7qbkXKuqhDcVh5EiB-EvWcZ-Ee44Tyta3D_1JbVRO6RPuMCqXxeBrmFojNLesGeztq1rYLC6LtU6fCHgbW3co9ACu3CmppeeFBb59z9pQUzVB2Dm6raS9nArLz1pXbAAiuSb201lLAcFxKY1FNqeYLY3UfVrouBQ1zLN4ySXyKLafqWtZNdZCWplwhQ4SvC7pjLt1-zl5', category: 'Hoodies' })} className="absolute inset-0 z-10" aria-label="Open KINETIC HEAVYWEIGHT" />
            <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
              <img
                alt="Urban heavy hoodie"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                data-alt="Heavyweight urban hoodie in charcoal grey with boxy silhouette, industrial studio setting with harsh lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUp0llnS7w0VCmZHxn0GGwyMtP3G8DQAHOjvvGxiPqyEQUXfUhec1pld1W_DM2T3mUVmu7qbkXKuqhDcVh5EiB-EvWcZ-Ee44Tyta3D_1JbVRO6RPuMCqXxeBrmFojNLesGeztq1rYLC6LtU6fCHgbW3co9ACu3CmppeeFBb59z9pQUzVB2Dm6raS9nArLz1pXbAAiuSb201lLAcFxKY1FNqeYLY3UfVrouBQ1zLN4ySXyKLafqWtZNdZCWplwhQ4SvC7pjLt1-zl5"
              />
              <button className="absolute top-4 right-4 z-20 p-2 bg-surface hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 flex flex-col flex-grow border-l border-surface-container-high md:border-l-0">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                  Kinetic Heavyweight
                </h3>
                <span className="font-brand text-2xl text-primary">$180</span>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button className="w-full bg-on-surface text-on-primary font-label font-bold py-4 px-6 uppercase tracking-widest hover:bg-primary active:scale-95 transition-all duration-200 relative z-20">
                  ADD TO CART
                </button>
                <button className="w-full border border-surface-container-high text-on-surface font-label font-bold py-3 px-6 uppercase tracking-widest hover:bg-surface-container-low transition-all duration-200 text-xs relative z-20">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface flex flex-col group relative">
            <Link href={productHref({ id: 203, name: 'TRACK 01 RUNNER', price: 290, collection: 'RUNNING / VELOCITY', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDplG5v4Dz9o7x7RDbchKaPEC-T5FjjImBRhqM4PSXIIGUwgj21YHbsYzOgIK4SHRKdgg17U_-Qh_vo1Zsva-ags2aNVG72YTqNNMKZed6jTBwWlOPJS46ZhE-F3Ovb2UwYQigR7UNKFOdnYdHzeSzDRBQVXb85HKg4kyoznVZkAffvF6OCFwWYtAvl-xJZlaHvXJLCOe1uHNI4nxwuG11YUmoeaNycGl_CnfvIzUSAAq8-BZy2qDgA_sEoGFLRY7SwzKqaZoy-WvHZ', category: 'Footwear' })} className="absolute inset-0 z-10" aria-label="Open TRACK 01 RUNNER" />
            <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
              <img
                alt="Racing inspired sneakers"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                data-alt="High-performance sneakers with sharp geometric soles and red accents, high contrast fashion photography"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDplG5v4Dz9o7x7RDbchKaPEC-T5FjjImBRhqM4PSXIIGUwgj21YHbsYzOgIK4SHRKdgg17U_-Qh_vo1Zsva-ags2aNVG72YTqNNMKZed6jTBwWlOPJS46ZhE-F3Ovb2UwYQigR7UNKFOdnYdHzeSzDRBQVXb85HKg4kyoznVZkAffvF6OCFwWYtAvl-xJZlaHvXJLCOe1uHNI4nxwuG11YUmoeaNycGl_CnfvIzUSAAq8-BZy2qDgA_sEoGFLRY7SwzKqaZoy-WvHZ"
              />
              <button className="absolute top-4 right-4 z-20 p-2 bg-surface hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                  Track 01 Runner
                </h3>
                <span className="font-brand text-2xl text-primary">$290</span>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button className="w-full bg-on-surface text-on-primary font-label font-bold py-4 px-6 uppercase tracking-widest hover:bg-primary active:scale-95 transition-all duration-200 relative z-20">
                  ADD TO CART
                </button>
                <button className="w-full border border-surface-container-high text-on-surface font-label font-bold py-3 px-6 uppercase tracking-widest hover:bg-surface-container-low transition-all duration-200 text-xs relative z-20">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface flex flex-col group relative">
            <Link href={productHref({ id: 204, name: 'CARGO TECH PANT', price: 210, collection: 'BOTTOMS / PERFORMANCE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMZASb7meK9s-TVwLsc-vmKkhTYIlqyzywtPtuM6G8_oOnG3YpXXkpa1JnB5--CoFcC0FqnrR6GVMga7q-WKowRrVzt2DU0cNlC2eLLZJA0pi6WgZgAl0C65QYfDkVnST5ffvSufdmyWTR8kHOJQiGppDLph5dIoUHwbo75knLNQFF1xP0cYPqunkeOHoBNUcm8NklhLFaEL9Oc2H9AyD7mwjnde57btn-opdMeSuIzsaA0ktiVQzJpbzJuMy5EjOJCqvQ-SYFzxev', category: 'Bottoms' })} className="absolute inset-0 z-10" aria-label="Open CARGO TECH PANT" />
            <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
              <img
                alt="Utility track pants"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                data-alt="Black utility cargo pants with multiple straps and zippers, minimalist technical look, soft directional lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMZASb7meK9s-TVwLsc-vmKkhTYIlqyzywtPtuM6G8_oOnG3YpXXkpa1JnB5--CoFcC0FqnrR6GVMga7q-WKowRrVzt2DU0cNlC2eLLZJA0pi6WgZgAl0C65QYfDkVnST5ffvSufdmyWTR8kHOJQiGppDLph5dIoUHwbo75knLNQFF1xP0cYPqunkeOHoBNUcm8NklhLFaEL9Oc2H9AyD7mwjnde57btn-opdMeSuIzsaA0ktiVQzJpbzJuMy5EjOJCqvQ-SYFzxev"
              />
              <button className="absolute top-4 right-4 z-20 p-2 bg-surface hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline font-bold text-xl uppercase tracking-tight">
                  Cargo Tech Pant
                </h3>
                <span className="font-brand text-2xl text-primary">$210</span>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button className="w-full bg-on-surface text-on-primary font-label font-bold py-4 px-6 uppercase tracking-widest hover:bg-primary active:scale-95 transition-all duration-200 relative z-20">
                  ADD TO CART
                </button>
                <button className="w-full border border-surface-container-high text-on-surface font-label font-bold py-3 px-6 uppercase tracking-widest hover:bg-surface-container-low transition-all duration-200 text-xs relative z-20">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden mt-20 text-center py-32 bg-surface-container-low border-2 border-dashed border-outline-variant/20">
          <h2 className="font-brand text-5xl mb-4">THE LIST IS EMPTY</h2>
          <p className="font-body text-zinc-500 mb-8 max-w-md mx-auto">
            Your gear selection for Season 04 is currently unpopulated. Return
            to the archive to begin your curation.
          </p>
          <a
            className="inline-block bg-on-surface text-on-primary font-label font-bold py-4 px-12 uppercase tracking-widest hover:bg-primary transition-all"
            href="#"
          >
            BACK TO ARCHIVE
          </a>
        </div>

        <section className="mt-32 overflow-hidden py-12 border-t border-b border-surface-container-high">
          <div className="flex whitespace-nowrap gap-12 items-center">
            <span className="font-brand text-8xl text-surface-container-highest tracking-tighter uppercase">
              SPEED AND PRECISION /{" "}
            </span>
            <span className="font-brand text-8xl text-primary tracking-tighter uppercase">
              KINETIC EDITORIAL /{" "}
            </span>
            <span className="font-brand text-8xl text-surface-container-highest tracking-tighter uppercase">
              STREET CULTURE REFINED /{" "}
            </span>
            <span className="font-brand text-8xl text-primary tracking-tighter uppercase">
              KINETIC EDITORIAL /{" "}
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
