"use client";

import { useState } from "react";

type Lang="uz"|"en";
type AuthResponse={access_token?:string;error_description?:string;msg?:string;message?:string;user?:{email_confirmed_at?:string|null}};
const config=()=>({url:process.env.NEXT_PUBLIC_SUPABASE_URL,key:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY});
export const storeToken=(token:string,remember:boolean)=>{sessionStorage.setItem("algoyol-access-token",token);if(remember)localStorage.setItem("algoyol-remember-token",token);else localStorage.removeItem("algoyol-remember-token")};
export const readStoredToken=()=>typeof window==="undefined"?null:sessionStorage.getItem("algoyol-access-token")||localStorage.getItem("algoyol-remember-token");

export function AuthPage({lang,done,notice}:{lang:Lang;done:(token?:string)=>void;notice?:string}){
 const [mode,setMode]=useState<"login"|"signup"|"confirm">("login"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[password2,setPassword2]=useState(""),[username,setUsername]=useState(""),[message,setMessage]=useState(notice||""),[busy,setBusy]=useState(false),[show,setShow]=useState(false),[remember,setRemember]=useState(false);
 const google=()=>{const {url,key}=config();if(!url||!key){setMessage(lang==="uz"?"Supabase ulanmagan — .env.local ni to‘ldiring.":"Supabase is not configured — fill .env.local.");return}
  // OAuth intentionally leaves the app origin for Supabase/Google.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`${url}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${window.location.origin}/`)}`)
 };
 const authenticate=async()=>{
  const {url,key}=config();if(!url||!key){setMessage(lang==="uz"?"Email tasdiqlash xizmati hali ulanmagan. Supabase sozlamalarini kiriting.":"Email confirmation is not configured yet. Add the Supabase settings.");return}
  if(!email||password.length<6||(mode==="signup"&&(!username||password!==password2))){setMessage(lang==="uz"?"Barcha maydonlarni to‘ldiring. Parollar mos kelsin, kamida 6 belgi.":"Complete every field. Passwords must match (min 6 chars).");return}
  setBusy(true);setMessage(lang==="uz"?"So‘rov yuborilmoqda…":"Sending request…");
  const redirect=`${window.location.origin}/`,endpoint=mode==="signup"?`signup?redirect_to=${encodeURIComponent(redirect)}`:"token?grant_type=password";
  try{
   const response=await fetch(`${url}/auth/v1/${endpoint}`,{method:"POST",headers:{apikey:key,"content-type":"application/json"},body:JSON.stringify({email,password,...(mode==="signup"?{data:{username,display_name:username}}:{})})});
   const result=await response.json() as AuthResponse;
   if(!response.ok){const text=result.error_description||result.msg||result.message||"Authentication failed";setMessage(String(text).toLowerCase().includes("confirm")?(lang==="uz"?"Avval emailingizdagi tasdiqlash havolasini bosing.":"Confirm your email before signing in."):text);return}
   if(mode==="signup"){if(result.access_token){setMessage(lang==="uz"?"Supabase’da Confirm Email sozlamasini yoqing.":"Enable Confirm Email in Supabase.");return}setMode("confirm");setMessage(lang==="uz"?`Tasdiqlash xabari ${email} manziliga yuborildi.`:`A confirmation message was sent to ${email}.`);return}
   if(!result.user?.email_confirmed_at){setMode("confirm");setMessage(lang==="uz"?"Avval emailingizni tasdiqlang.":"Confirm your email before signing in.");return}
   if(!result.access_token){setMessage(lang==="uz"?"Sessiya tokeni olinmadi.":"No session token was returned.");return}storeToken(result.access_token,remember);done(result.access_token);
  }catch{setMessage(lang==="uz"?"Email xizmatiga ulanib bo‘lmadi.":"Could not connect to the email service.")}finally{setBusy(false)}
 };
 const resend=async()=>{const {url,key}=config();if(!url||!key)return;setBusy(true);try{const response=await fetch(`${url}/auth/v1/resend?redirect_to=${encodeURIComponent(`${window.location.origin}/`)}`,{method:"POST",headers:{apikey:key,"content-type":"application/json"},body:JSON.stringify({type:"signup",email})});const result=await response.json() as AuthResponse;setMessage(response.ok?(lang==="uz"?"Tasdiqlash xabari qayta yuborildi.":"Confirmation email sent again."):(result.msg||result.message||"Could not resend"))}finally{setBusy(false)}};
 return <div className="auth">
  <div className="brand"><span className="brandmark">A›</span>AlgoYo‘l</div>
  <h1>{mode==="login"?(lang==="uz"?"Xush kelibsiz":"Welcome back"):mode==="signup"?(lang==="uz"?"Hisob yarating":"Create account"):(lang==="uz"?"Emailingizni tekshiring":"Check your email")}</h1>
  <p className="muted">{mode==="confirm"?(lang==="uz"?"Xabardagi tasdiqlash tugmasini bosing. Shundan keyin AlgoYo‘l avtomatik ochiladi.":"Click the confirmation button in the email. AlgoYo‘l will open automatically afterward."):(lang==="uz"?"O‘rganing. Mashq qiling. Duelda bellashing. O‘sing.":"Learn. Practice. Duel. Grow.")}</p>
  {message&&<div className="notice" role="status" aria-live="polite">{message}</div>}
  {mode!=="confirm"&&<button className="google-btn" onClick={google}><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.2h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.2-2.1 3.7-5.1 3.7-8.7z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.1 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.4 8.2 0 10 0 12s.4 3.8 1.2 5.3l3.9-3z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3c1-2.9 3.7-5 6.9-5z"/></svg>{lang==="uz"?"Google orqali kirish":"Continue with Google"}</button>}
  {mode!=="confirm"&&<div className="auth-divider"><span>{lang==="uz"?"yoki email bilan":"or with email"}</span></div>}
  {mode==="signup"&&<div className="field"><label htmlFor="auth-username">Username</label><input id="auth-username" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" placeholder="algoyolchi"/></div>}
  {mode!=="confirm"&&<>
   <div className="field"><label htmlFor="auth-email">Email</label><input id="auth-email" value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email" placeholder="siz@example.com"/></div>
   <div className="field"><label htmlFor="auth-password">{lang==="uz"?"Parol":"Password"}</label><div className="pwd-wrap"><input id="auth-password" value={password} onChange={e=>setPassword(e.target.value)} type={show?"text":"password"} autoComplete={mode==="signup"?"new-password":"current-password"} placeholder="••••••••"/><button type="button" className="pwd-toggle" onClick={()=>setShow(!show)} aria-label={show?"Hide password":"Show password"}>{show?"Hide":"Show"}</button></div></div>
   {mode==="signup"&&<div className="field"><label htmlFor="auth-password-confirm">{lang==="uz"?"Parolni tasdiqlang":"Confirm password"}</label><input id="auth-password-confirm" value={password2} onChange={e=>setPassword2(e.target.value)} type={show?"text":"password"} autoComplete="new-password" placeholder="••••••••"/></div>}
   {mode==="login"&&<label className="remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> {lang==="uz"?"Eslab qolish":"Remember me"}</label>}
   <button disabled={busy} className="primary" style={{width:"100%"}} onClick={authenticate}>{busy?(lang==="uz"?"Kuting…":"Please wait…"):mode==="login"?(lang==="uz"?"Kirish":"Sign in"):(lang==="uz"?"Ro‘yxatdan o‘tish":"Create account")}</button>
  </>}
  {mode==="confirm"&&<><button disabled={busy} className="primary" style={{width:"100%"}} onClick={resend}>{lang==="uz"?"Xabarni qayta yuborish":"Resend confirmation"}</button><button className="lang" style={{width:"100%",marginTop:10}} onClick={()=>setMode("login")}>{lang==="uz"?"Kirish sahifasiga qaytish":"Back to sign in"}</button></>}
  {mode!=="confirm"&&<button className="lang" style={{width:"100%",marginTop:12}} onClick={()=>setMode(mode==="login"?"signup":"login")}>{mode==="login"?(lang==="uz"?"Hisob yo‘qmi? Ro‘yxatdan o‘tish":"No account? Register"):(lang==="uz"?"Hisobingiz bormi? Kirish":"Have an account? Sign in")}</button>}
 </div>;
}
