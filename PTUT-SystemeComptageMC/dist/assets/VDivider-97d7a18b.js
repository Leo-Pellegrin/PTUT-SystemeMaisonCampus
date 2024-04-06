import{m as T,u as I,k as j,b as Z}from"./VGrid-42409ed8.js";import{p as b,K as D,R as J,S as q,g as x,u as S,j as E,k as o,Z as Q,a7 as X,U as p,C as c,c as d,v as N,b as ee,l as le,m as A,V as te,W as ae,G as ne,Y as oe,q as P,ab as ie,B as ue,i as re,T as ce,A as W}from"./index-0cf8a666.js";import{s as se,R as de,i as ve,U as me,y as fe}from"./VApp-18948c5a.js";const H=Symbol.for("vuetify:selection-control-group"),L=b({color:String,disabled:{type:Boolean,default:null},defaultsTarget:String,error:Boolean,id:String,inline:Boolean,falseIcon:D,trueIcon:D,ripple:{type:Boolean,default:!0},multiple:{type:Boolean,default:null},name:String,readonly:{type:Boolean,default:null},modelValue:null,type:String,valueComparator:{type:Function,default:J},...T(),...se(),...q()},"SelectionControlGroup"),ye=b({...L({defaultsTarget:"VSelectionControl"})},"VSelectionControlGroup");x()({name:"VSelectionControlGroup",props:ye(),emits:{"update:modelValue":e=>!0},setup(e,i){let{slots:u}=i;const l=S(e,"modelValue"),a=E(),s=o(()=>e.id||`v-selection-control-group-${a}`),r=o(()=>e.name||s.value),t=new Set;return Q(H,{modelValue:l,forceUpdate:()=>{t.forEach(n=>n())},onForceUpdate:n=>{t.add(n),X(()=>{t.delete(n)})}}),p({[e.defaultsTarget]:{color:c(e,"color"),disabled:c(e,"disabled"),density:c(e,"density"),error:c(e,"error"),inline:c(e,"inline"),modelValue:l,multiple:o(()=>!!e.multiple||e.multiple==null&&Array.isArray(l.value)),name:r,falseIcon:c(e,"falseIcon"),trueIcon:c(e,"trueIcon"),readonly:c(e,"readonly"),ripple:c(e,"ripple"),type:c(e,"type"),valueComparator:c(e,"valueComparator")}}),I(()=>{var n;return d("div",{class:["v-selection-control-group",{"v-selection-control-group--inline":e.inline},e.class],style:e.style,role:e.type==="radio"?"radiogroup":void 0},[(n=u.default)==null?void 0:n.call(u)])}),{}}});const M=b({label:String,baseColor:String,trueValue:null,falseValue:null,value:null,...T(),...L()},"VSelectionControl");function Ce(e){const i=oe(H,void 0),{densityClasses:u}=fe(e),l=S(e,"modelValue"),a=o(()=>e.trueValue!==void 0?e.trueValue:e.value!==void 0?e.value:!0),s=o(()=>e.falseValue!==void 0?e.falseValue:!1),r=o(()=>!!e.multiple||e.multiple==null&&Array.isArray(l.value)),t=o({get(){const f=i?i.modelValue.value:l.value;return r.value?P(f).some(v=>e.valueComparator(v,a.value)):e.valueComparator(f,a.value)},set(f){if(e.readonly)return;const v=f?a.value:s.value;let y=v;r.value&&(y=f?[...P(l.value),v]:P(l.value).filter(V=>!e.valueComparator(V,a.value))),i?i.modelValue.value=y:l.value=y}}),{textColorClasses:n,textColorStyles:C}=j(o(()=>{if(!(e.error||e.disabled))return t.value?e.color:e.baseColor})),{backgroundColorClasses:g,backgroundColorStyles:h}=Z(o(()=>t.value&&!e.error&&!e.disabled?e.color:void 0)),B=o(()=>t.value?e.trueIcon:e.falseIcon);return{group:i,densityClasses:u,trueValue:a,falseValue:s,model:t,textColorClasses:n,textColorStyles:C,backgroundColorClasses:g,backgroundColorStyles:h,icon:B}}const _=x()({name:"VSelectionControl",directives:{Ripple:de},inheritAttrs:!1,props:M(),emits:{"update:modelValue":e=>!0},setup(e,i){let{attrs:u,slots:l}=i;const{group:a,densityClasses:s,icon:r,model:t,textColorClasses:n,textColorStyles:C,backgroundColorClasses:g,backgroundColorStyles:h,trueValue:B}=Ce(e),f=E(),v=N(!1),y=N(!1),V=ee(),k=o(()=>e.id||`input-${f}`),F=o(()=>!e.disabled&&!e.readonly);a==null||a.onForceUpdate(()=>{V.value&&(V.value.checked=t.value)});function U(m){F.value&&(v.value=!0,ie(m.target,":focus-visible")!==!1&&(y.value=!0))}function G(){v.value=!1,y.value=!1}function O(m){m.stopPropagation()}function z(m){F.value&&(e.readonly&&a&&ue(()=>a.forceUpdate()),t.value=m.target.checked)}return I(()=>{var R,w;const m=l.label?l.label({label:e.label,props:{for:k.value}}):e.label,[K,Y]=le(u),$=d("input",A({ref:V,checked:t.value,disabled:!!e.disabled,id:k.value,onBlur:G,onFocus:U,onInput:z,"aria-disabled":!!e.disabled,type:e.type,value:B.value,name:e.name,"aria-checked":e.type==="checkbox"?t.value:void 0},Y),null);return d("div",A({class:["v-selection-control",{"v-selection-control--dirty":t.value,"v-selection-control--disabled":e.disabled,"v-selection-control--error":e.error,"v-selection-control--focused":v.value,"v-selection-control--focus-visible":y.value,"v-selection-control--inline":e.inline},s.value,e.class]},K,{style:e.style}),[d("div",{class:["v-selection-control__wrapper",n.value],style:C.value},[(R=l.default)==null?void 0:R.call(l,{backgroundColorClasses:g,backgroundColorStyles:h}),te(d("div",{class:["v-selection-control__input"]},[((w=l.input)==null?void 0:w.call(l,{model:t,textColorClasses:n,textColorStyles:C,backgroundColorClasses:g,backgroundColorStyles:h,inputNode:$,icon:r.value,props:{onFocus:U,onBlur:G,id:k.value}}))??d(ne,null,[r.value&&d(ve,{key:"icon",icon:r.value},null),$])]),[[ae("ripple"),e.ripple&&[!e.disabled&&!e.readonly,null,["center","circle"]]]])]),m&&d(me,{for:k.value,onClick:O},{default:()=>[m]})])}),{isFocused:v,input:V}}}),Ve=b({indeterminate:Boolean,indeterminateIcon:{type:D,default:"$checkboxIndeterminate"},...M({falseIcon:"$checkboxOff",trueIcon:"$checkboxOn"})},"VCheckboxBtn"),Se=x()({name:"VCheckboxBtn",props:Ve(),emits:{"update:modelValue":e=>!0,"update:indeterminate":e=>!0},setup(e,i){let{slots:u}=i;const l=S(e,"indeterminate"),a=S(e,"modelValue");function s(n){l.value&&(l.value=!1)}const r=o(()=>l.value?e.indeterminateIcon:e.falseIcon),t=o(()=>l.value?e.indeterminateIcon:e.trueIcon);return I(()=>{const n=re(_.filterProps(e),["modelValue"]);return d(_,A(n,{modelValue:a.value,"onUpdate:modelValue":[C=>a.value=C,s],class:["v-checkbox-btn",e.class],style:e.style,type:"checkbox",falseIcon:r.value,trueIcon:t.value,"aria-checked":l.value?"mixed":void 0}),u)}),{}}});const be=b({color:String,inset:Boolean,length:[Number,String],thickness:[Number,String],vertical:Boolean,...T(),...q()},"VDivider"),Ie=x()({name:"VDivider",props:be(),setup(e,i){let{attrs:u}=i;const{themeClasses:l}=ce(e),{textColorClasses:a,textColorStyles:s}=j(c(e,"color")),r=o(()=>{const t={};return e.length&&(t[e.vertical?"maxHeight":"maxWidth"]=W(e.length)),e.thickness&&(t[e.vertical?"borderRightWidth":"borderTopWidth"]=W(e.thickness)),t});return I(()=>d("hr",{class:[{"v-divider":!0,"v-divider--inset":e.inset,"v-divider--vertical":e.vertical},l.value,a.value,e.class],style:[r.value,s.value,e.style],"aria-orientation":!u.role||u.role==="separator"?e.vertical?"vertical":"horizontal":void 0,role:`${u.role||"separator"}`},null)),{}}});export{Se as V,Ie as a,Ve as m};