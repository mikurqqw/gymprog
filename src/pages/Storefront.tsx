import { lazy,Suspense } from 'react';
import { Route,Routes } from 'react-router-dom';
import { StorefrontShell } from '../components/StorefrontShell';
import Landing from './Landing';
const Catalog=lazy(()=>import('./Catalog'));
const ProgramOffer=lazy(()=>import('./ProgramOffer'));
const ProductDemo=lazy(()=>import('./ProductDemo'));
export default function Storefront(){return <StorefrontShell><Suspense fallback={<div className="skeleton" aria-busy="true"/>}><Routes><Route index element={<Landing/>}/><Route path="welcome" element={<Landing/>}/><Route path="catalog" element={<Catalog/>}/><Route path="catalog/:id" element={<ProgramOffer/>}/><Route path="demo" element={<ProductDemo/>}/></Routes></Suspense></StorefrontShell>;}
