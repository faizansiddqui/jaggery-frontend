import type { Product } from '@/app/data/products';

export interface ProductDetailProps {
    product: Product;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    dateTime: string;
    createdAt: number;
    images: string[];
}

export interface ReviewSlide {
    key: string;
    src: string;
    author: string;
    text: string;
    dateTime: string;
}

export interface ReviewViewerState {
    slides: ReviewSlide[];
    index: number;
}

export interface ReviewFormState {
    author: string;
    rating: number;
    text: string;
    images: string[];
}

export type ReviewSort = 'latest' | 'highest' | 'lowest';
