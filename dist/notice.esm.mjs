function e(){return function(){let e={"*":[]},t={},n=[],o=!1,c="";return{on:function(t,n){e[t]||(e[t]=[]),e[t].push(n)},once:function(e,n){"*"!==e&&(t[e]||(t[e]=[]),t[e].push(n))},off:function(n,o){if(o)return e[n]&&(e[n]=e[n].filter((e=>e!==o))),t[n]&&(t[n]=t[n].filter((e=>e!==o))),e[n]&&0===e[n].length&&delete e[n],void(t[n]&&0===t[n].length&&delete e[n]);t[n]&&delete t[n],e[n]&&delete e[n]},reset:function(){e={"*":[]},t={},n=[]},emit:function(){const[f,...i]=arguments;function l(t){let o=!1;"*"!==t&&(n.includes(t)||(e[t].every((e=>{const t=e(...i);return"string"!=typeof t||("STOP"!==t.toUpperCase()||(o=!0,!1))})),o||e["*"].forEach((e=>e(f,...i)))))}if(o&&(console.log(`${c} Event "${f}" was triggered.`),i.length>0&&(console.log("Arguments:"),console.log(...i),console.log("^----"))),"*"!==f){if(t[f]){if(n.includes(f))return;t[f].forEach((e=>e(...i))),delete t[f]}e[f]&&l(f)}else{Object.keys(e).forEach((e=>l(e)))}},stop:function(o){if("*"!==o)n.push(o);else{const o=Object.keys(e),c=Object.keys(t);n=[...c,...o]}},start:function(e){n="*"!==e?n.filter((t=>e!=t)):[]},debug:function(e,t){o=!!e,t&&"string"==typeof t&&(c=t)}}}()}export{e as default};
