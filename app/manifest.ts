import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest { return { name:'TDP PLAY', short_name:'TDP PLAY', description:'Simulador deportivo con TDP Coins virtuales.', start_url:'/', display:'standalone', background_color:'#050b08', theme_color:'#16a34a', icons:[{src:'/icons/icon.svg',sizes:'any',type:'image/svg+xml'}] }; }
