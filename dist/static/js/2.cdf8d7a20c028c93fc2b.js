webpackJsonp([2],{Q3iZ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("woOf"),r=a.n(i),c=a("GlpD"),n=a("erh5"),s=function(t,e,a,i){return Object(n.a)("/v2/ecapi.category.list","POST",{shop:t,category:e,page:a,per_page:i})},o=100;var u={data:function(){return{items:[],currentItem:{}}},components:{tabBar:c.a},created:function(){this.loadItem()},methods:{loadItem:function(){var t,e,a=this;(t=null,e=null,s(t,e,1,o)).then(function(t){var e=t.categories;a.items=r()([],e,a.items),a.currentItem=a.items[0]})},setIsActiveByClick:function(t){this.currentItem=t},goProduct:function(t){var e={category:t};this.$router.push({name:"product",params:e})}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ui-category-wrapper"},[a("div",{staticClass:"category-wrapper"},[a("div",{staticClass:"category-flex"},[a("div",{staticClass:"category-sidebar"},[a("ul",t._l(t.items,function(e){return a("li",{key:e.id,staticClass:"item",class:{sidbaractive:e.id==t.currentItem.id,noActive:e.id!=t.currentItem.id},on:{click:function(a){t.setIsActiveByClick(e)}}},[a("a",[t._v(t._s(e.name))])])}))]),t._v(" "),t.currentItem.more?a("div",{staticClass:"category-content"},[a("ul",t._l(t.currentItem.categories,function(e){return a("li",{key:e.id,staticClass:"item",on:{click:function(a){t.goProduct(e.id)}}},[a("a",[t._v(t._s(e.name))])])}))]):t._e()])]),t._v(" "),a("tab-bar")],1)},staticRenderFns:[]};var d=a("VU/8")(u,l,!1,function(t){a("aFaL")},"data-v-2b8bac43",null);e.default=d.exports},aFaL:function(t,e){}});
//# sourceMappingURL=2.cdf8d7a20c028c93fc2b.js.map