<!-- ProductListHeader.vue -->
<template>
	<div class="ui-product-header">
		<form action="#" v-on:submit.prevent="search($event)">
			<div class="search">
				<img src="../../../assets/image/change-icon/back@2x.png" class="ui-back" @click="goBack()">
				<input type="search" placeholder="请输入您要搜索的商品" v-model="keyword" autocomplete="off">
				<img src="../../../assets/image/change-icon/b2_cart@2x.png" class="ui-cart" v-on:click='goCart()'>
				<span class="cart-number" v-if="cartNumber <= 100 && cartNumber > 0">{{ cartNumber }}</span>
			<span class="cart-number" v-if="cartNumber >= 100  && cartNumber > 0 ">99+</span>
			</div>
		</form>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { cartQuantity } from '../../../api/network/cart';
	import { Toast } from 'mint-ui';

	export default {
		props:['value'],

		data() {
			return {
				keyword: this.value ? this.value : ''  //关键字
			}
		},

		created(){},

		computed: mapState({
			isSearch: state => state.product.isSearch,
			isOnline: state => state.auth.isOnline,
			cartNumber: state => state.tabBar.cartNumber
		}),

		watch: {
			value: function(value) {
				if (value) {
					this.keyword = value;
				}
			}
		},

		methods: {
			...mapMutations({
				changeSearch: 'changeSearch',
				setCartNumber: 'setCartNumber'
			}),

			/*
			 * search: 搜索
			 */
			search(e) {
				let data = {
					'keyword': this.keyword
				};
				if (!data.keyword) {
					Toast('请输入您要搜索的关键字');
					return;
				}
				this.$parent.$emit('change-list', data);
				if (e) {
					this.utils.stopPrevent(e);
				}
			},

			/*
			 * goBack: 返回上一级
			 */
			goBack() {
				let isFromHome = this.$route.params.isFromHome
				if (isFromHome) {
					this.$router.push({ name: 'home' })
				}	else {
					this.$router.go(-1);
				}
			},

			/*
			 *  getCarNumber: 获取购物车数量
			 */
			getCarNumber() {
				cartQuantity().then(res => {
					if (res) {
						this.setCartNumber(res.quantity);
					}
				})
			},

			/*
			 *  goCart: 跳转到购物车列表
			 */
			goCart() {
				if (this.isOnline) {
					this.$router.push({'name': 'cart', 'params': {type: 0}});
				} else {
					this.$router.push({'name': 'signin'});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ui-product-header {
		div.search {
			display: flex;
			width: auto;
			height: auto;
			padding: 6px 16px;
			align-content: center;
	    align-items: center;
			img.ui-back {
				height: 24px;
    		width: 24px;
			}
			input{
				width: 100%;
			  margin-left: 16px;
			  margin-right: 17px;
				flex-basis: auto;
				border-radius: 16px;
				border: 0px;
				background: url('../../../assets/image/change-icon/search@2x.png') no-repeat 8px center;
				background-size: 16px;
				background-color: #E9ECF0;
				padding: 9px;
				padding-left: 30px;
				color: #A4AAB3;
				font-family: 'PingFangSC';
				font-size: 14px;
				height: 32px;
				border: 0px;
				padding-top: 0px;
				padding-bottom: 0px;
				&:focus {
					outline-offset: 0px;
					outline: none;
				}
			}
			img.ui-cart {
				width: 30px;
				height: 30px;
			}
			span.cart-number {
			  top: 5px;
			  right: 20px;
			  min-width: 18px;
			  min-height: 14px;
			  line-height: 14px;
			}
		}
	}
</style>
