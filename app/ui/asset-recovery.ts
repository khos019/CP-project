/* Runs in <head> before the bundle. When one of the site's own /assets/ files
   fails to load — the page came from a deploy whose files this edge does not
   have yet, or from one whose files are already gone — the page would sit
   there drawn but dead: nothing hydrates, so no link opens anything. Reloading
   picks up a consistent build, and that is what fixed it by hand.

   At most once a minute per tab, so an asset that is truly missing does not
   become a reload loop. Ad and analytics scripts live on other hosts and are
   ignored: an ad blocker failing them is not a reason to reload. */
export const ASSET_RECOVERY_SCRIPT = `(function(){window.addEventListener("error",function(e){var t=e.target;if(!t||(t.tagName!=="SCRIPT"&&t.tagName!=="LINK"))return;var u=t.src||t.href||"";if(u.indexOf(location.origin+"/assets/")!==0)return;try{var k="algoyol-asset-reload",l=Number(sessionStorage.getItem(k))||0;if(Date.now()-l<60000)return;sessionStorage.setItem(k,String(Date.now()))}catch(_){return}location.reload()},true)})();`;
