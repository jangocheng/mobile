<!-- CouponTab.vue -->
<template>
	<div class="ui-coupon-wrapper">
		<ul>
			<li class="item" v-for="(item, index) in tab" v-bind:class="{'active': item.id == currentItem.id}" @click="setCurrentItem(item)">{{ item.name }}</li>
		</ul>
	</div>
</template>

<script>
	import { TAB } from '../static';
	export default {
		data() {
			return {
				tab: TAB,
				currentItem: TAB[0]
			}
		},

		methods: {
			/*
			 * setCurrentItem: 点击tab 设置当前显示的tab
			 * @params item ： 当前点击的item
			 */
			setCurrentItem(item) {
				this.currentItem = item;
				this.$parent.$emit('redener-coupon-list', this.currentItem);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ui-coupon-wrapper {
		height: 44px;
		line-height: 44px;
		background:rgba(255,255,255,1);
		ul {
			padding: 0px;
			margin: 0px;
			list-style: none;

			display: flex;
			justify-content: space-around;
			align-content: center;
			align-items: center;
			border-bottom: 0.5px solid RGBA(232, 234, 237, 1);
			li {
				height: -webkit-fill-available;
				padding: 0px 10px;
				font-size:14px;
				color:rgba(124,127,136,1);
				border-bottom: 2px solid;
				border-bottom-color: transparent;
				&.active {
					color:rgba(242,48,48,1);
					border-bottom-color: #F23030;
				}
			}
		}
	}
</style>
