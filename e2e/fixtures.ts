import { initialState } from '../src/lib/storage';
import { HEALTH_SCREEN_VERSION } from '../src/config/versions';
import { test as base,expect } from '@playwright/test';
import { legalConfig } from '../src/config/legal.config';
export const test=base.extend<{adultConsent:void}>({adultConsent:[async({page},use)=>{
 await page.addInitScript(({versions,initial,screenVersion})=>{if(!localStorage.getItem('ironcycle:consent')){const acceptedAt=new Date().toISOString();localStorage.setItem('ironcycle:consent',JSON.stringify({schemaVersion:1,adult:true,acceptedAt,language:'ru',versions,terms:true,privacy:true,health:true,medical:true,calories:true}));localStorage.setItem('ironcycle:preferences',JSON.stringify({language:'ru',necessary:true,optionalMedia:false,selectedAt:acceptedAt}));}if(!localStorage.getItem('ironcycle:data'))localStorage.setItem('ironcycle:data',JSON.stringify({...initial,onboarded:true,profile:{...initial.profile,healthScreenVersion:screenVersion,healthScreenedAt:new Date().toISOString()}}));},{versions:legalConfig.documentVersions,initial:initialState,screenVersion:HEALTH_SCREEN_VERSION});
 await use();
},{auto:true}]});
export {expect};
