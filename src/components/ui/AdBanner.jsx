import React, { useEffect } from 'react';

export default function AdBanner({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = 'true',
  style = { display: 'block', minHeight: '90px' },
  className = ''
}) {
  useEffect(() => {
    // Only attempt to push the ad if AdSense is loaded and we're not in a dev SSR environment
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (err) {
      console.warn('AdSense block error:', err);
    }
  }, []); // Run once when the component mounts

  // While pending AdSense approval, or in local development, 
  // you might want to show a placeholder to visualize the layout.
  const isDev = window.location.hostname === 'localhost';

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-color my-4 ${className}`}>
      {isDev ? (
        <div className="flex items-center justify-center w-full h-[150px] bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm italic rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          Google AdSense Banner Space
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client="ca-pub-4399943882344598"
          data-ad-slot={adSlot || "1234567890"} // Replace this default with your actual ad unit ID later
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive}
        ></ins>
      )}
    </div>
  );
}
