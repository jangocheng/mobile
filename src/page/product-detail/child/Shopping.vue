<!-- Shopping.vue -->
<template>
	<mt-popup  v-model="isShowcartInfo" position="bottom" v-if="detailInfo"  v-bind:close-on-click-modal=false>
		<div class="ui-add-shopping" v-if="detailInfo">
			<div class="shopping-info">

				<div class="info-header">
					<img src="../../../assets/image/change-icon/default_image_02@2x.png" class="info-image" v-if=' !detailInfo.photos  || detailInfo.photos.length <= 0'>
					<img v-bind:src="detailInfo.photos[0].thumb" class="info-image" v-if='detailInfo.photos && detailInfo.photos.length > 0'>
					<div>
						<span v-if="detailInfo.properties.length <= 0">AED {{ detailInfo.current_price }}</span>
						<span v-if="detailInfo.properties.length > 0 && ids.length == detailInfo.properties.length">AED {{ utils.currencyPrice(propertiPrice) }}</span>
						<span v-if="detailInfo.properties.length > 0 && ids.length != detailInfo.properties.length">AED {{detailInfo.current_price}}</span>
						<span>
							<img src="../../../assets/image/change-icon/b2_tag@2x.png" v-if='detailInfo.activity'>
							<span v-if='detailInfo.activity'>{{detailInfo.activity.name}}</span>
						</span>
						<!-- {{ chooseinfo}} -->
						<span v-if="ids.length > 0 ">已选{{ info.join(',') }} &nbsp;数量：{{ numbers }}</span>
						<span v-if="ids.length <= 0 ">数量：{{ numbers }}</span>
					</div>
					<img src="../../../assets/image/change-icon/close@2x.png" class="close" v-on:click='closeCartInfo(false)'>
				</div>

				<div class="goods-detail-properties">
					<div class="goods-properties" v-if="detailInfo && detailInfo.properties && detailInfo.properties.length > 0" v-for="(item, index) in detailInfo.properties" :key="index">
						<p>{{ item.name }}</p>
						<div class="properties-list">
							<div v-for="(key, keyindex) in item.attrs" :key="keyindex">
								<span @click="setCurrentIndex(index, key.id, key)"
								v-bind:class="{'active-properties': item.currentIndex == key.id}"
								v-if="key.ishasstock"
								>{{ key.attr_name }}</span>
								<span v-bind:class="{'disabled-properties': !key.ishasstock}" v-if="!key.ishasstock">{{ key.attr_name }}</span>
							</div>
						</div>
					</div>
					<div class="info-body" id="info-body">
						<p>数量</p>
						<div class="ui-number">
							<!-- <img src="../../../assets/image/change-icon/b3_minus_dis@2x.png" v-if="numbers <= 1" v-on:click='reduceNumber()'><img src="../../../assets/image/change-icon/b3_minus@2x.png" v-if="numbers > 1" v-on:click='reduceNumber()'><input type="number" min="1" class="number" value='1' v-model="numbers" v-on:focus='keyDown($event)'><img src="../../../assets/image/change-icon/b3_plus@2x.png" v-on:click='addNumber()'> -->
							<ul class="count">
			                    <li><img src="../../../assets/image/change-icon/b3_minus_dis@2x.png" v-if="numbers <= 1" v-on:click='reduceNumber()'><img src="../../../assets/image/change-icon/b3_minus@2x.png" v-if="numbers > 1" v-on:click='reduceNumber()'></li><li><input type="number" min="1" class="number" value='1' v-model="numbers" v-on:focus='keyDown($event)'></li><li><img src="../../../assets/image/change-icon/b3_plus@2x.png" v-on:click='addNumber()'></li>
			                </ul>
						</div>
					</div>
				</div>
				<div class="info-footer" v-on:click='addShoppingCart()'>{{ type }}</div>
			</div>
		</div>
		</mt-popup>
	</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { Toast } from 'mint-ui';

	import { cartAdd, cartQuantity } from '../../../api/network/cart';

	import { ENUM } from '../../../config/enum';

	export default {
	data(){
		return {
			numbers: this.$store.state.detail.number > 0 ? this.$store.state.detail.number : 1,  //todo 临时解决
			productId: this.$store.state.detail.currentProductId,
			toastConfig: {
				message: '商品达到每单限购数量',
				position: 'middle'
			},
			ids: [],
			info: [],
			propertiPrice: 0,
			earlier: {}
		}
	},

	props: {
		isShowcartInfo: {
			type: Boolean,
			default: false
		}
	},

	created(){
		this.info = this.chooseinfo.specification;
		this.ids = Object.assign([], this.chooseinfo.ids);
		this.buildProperties(true);
	},

	computed: {
		...mapState({
			isOnline: state => state.auth.isOnline,
			detailInfo: state => state.detail.detailInfo,
			number: state => state.detail.number,
			chooseinfo: state => state.detail.chooseinfo,
			type: state => state.detail.type
		})
	},

	watch: {
		numbers: function(value) {
			if (value) {
				let good_stock = this.getGoodsStock();
				if (value <= 0) {
					this.numbers = 1;
					this.toastConfig.message = '受不了了，宝贝不能再少了';
					Toast(this.toastConfig);
				} else if (value > good_stock) {
					this.toastConfig.message = '商品库存不足';
					Toast(this.toastConfig);
					this.numbers = good_stock;
				}
				this.saveNumber(this.numbers);
			}
		},
	},

	mounted(){},

	methods: {
			...mapMutations({
				saveCartState: 'saveCartState',
				saveNumber: 'saveNumber',
				saveChooseInfo: 'saveChooseInfo',
				saveProperties: 'saveProperties',
				setCartNumber: 'setCartNumber'
			}),

			// 关闭购物车浮层
			closeCartInfo(value) {
				this.saveCartState(value);
			},

			/*
			 * getGoodsStock: 获取是否还有库存
			 */
			getGoodsStock() {
				let good_stock = 0;
				if (this.ids.length <= 0) {
					good_stock = this.detailInfo.good_stock;
				} else {
					let str = this.fromatArray('|', this.ids);
					let stock = this.isHasStock(str);
					good_stock = stock ? parseInt(stock) : this.detailInfo.good_stock;
				}
				return good_stock;
			},

			// 数量加
			addNumber() {
				let good_stock = this.getGoodsStock();
				if (this.detailInfo.good_stock && this.numbers > good_stock) {
					this.toastConfig.message = '商品库存不足';
					Toast(this.toastConfig);
					this.numbers = good_stock;
				} else {
					this.numbers++;
				}
			},

			// 数量减
			reduceNumber() {
				if (this.numbers > 1) {
					this.numbers--;
				} else {
					this.numbers = 1;
					this.toastConfig.message = '受不了了，宝贝不能再少了';
					Toast(this.toastConfig);
				}
			},

			// 加入购物车
			addShoppingCart() {
				if (!this.isOnline) {
					this.$router.push({'name': 'signin'});
				} else {
					if (this.detailInfo.properties.length > 0) {
						let status = true;
						if ( this.ids.length <= 0 ) {
							status = false;
						} else {
							for (let i = 0; i <= this.ids.length-1; i++) {
								if (this.ids[i] == "" || this.ids[i] == undefined ) {
									status = false;
									break;
								}
							}
						}
						if (status) {
							this.addShopCart();
						} else {
							Toast('请选择商品属性');
							return false;
						}
					} else {
						this.addShopCart();
					}
				}
			},

			addShopCart() {
				let params = {'product': this.productId, 'property': '', 'amount': this.numbers};
				if (this.ids.length > 0) {
					params.property = JSON.stringify(this.ids);
					let str = this.fromatArray('|', this.ids),
					    stock = this.isHasStock(str);
					if (parseInt(stock) <= 0) {
						Toast('商品库存不足');
						return false;
					}
				}
				cartAdd(params.product, params.property, params.amount).then(res => {
					this.$parent.$emit('start-addcart-animation');
					if (res.cart_goods) {
						this.saveNumber(this.numbers);
						this.getCarNumber();
						this.$parent.$emit('end-addcart-animation');
					}
				},(error) => {
					Toast(error.errorMsg);
				})
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

			keyDown(event) {},

			/*
			 * buildProperties: 构建多属性， 为每个规格添加当前点击的id值
			 */
			buildProperties(isbckfill) {
				if ( this.detailInfo && this.detailInfo.properties && this.detailInfo.properties.length > 0) {
					let properties = this.detailInfo.properties,
						len = properties.length,
						currentId = [];
					// 循环 最外层的属性
					for (let p = 0; p <= len - 1; p++ ) {
						properties[p].currentIndex = '';
						//
						let attrs = properties[p].attrs;
						for (let a = 0; a <= attrs.length - 1; a++ ) {
							this.setIsHasStock(p, attrs[a].id, attrs[a]);
						}
						if (isbckfill) {
							// 数据回填
							if (this.ids.length > 0) {
								for (let x = 0; x <= this.ids.length-1; x++) {
									if ( x == p && this.ids[x]) {
										properties[p].currentIndex = this.ids[x];
									}
								}
							}
							if (properties[p].currentIndex) {
								currentId[p] = properties[p].currentIndex;
							}
						}
					}
					for (let i = 0; i <= currentId.length -1; i++ ) {
						if (currentId[i]) {
							let newsData = this.getNewDataById(i, currentId[i]);
							this.getCurrentStock(i, currentId[i], newsData);
						}
					}
				}
			},

			/*
			 * setIsHasStock: 设置是否还有库存
			 */
			setIsHasStock(index, id, item) {
				let data = this.detailInfo.stock,
					count = 0;
				for (let s = 0; s <= data.length -1; s++) {
					this.setPriceByProperty(data[s]);
		 			if (data[s].goods_attr.indexOf(''+id+'') >= 0){
		 				count = count + data[s].stock_number;
		 				if (count > 0) {
		 					item.ishasstock = true;
		 				} else {
		 					item.ishasstock = false;
		 				}
		 			}
		 		}
		 		this.detailInfo.properties = Object.assign([], this.detailInfo.properties);
			},

			/*
			 * setCurrentIndex: 设置当前选中的规格的id,
			 * @parmas: index 当前规格的index
			 * @parmas: keyid 当前选择的规格的index
			 */
			 setCurrentIndex(index, keyid, item) {
			 	this.info = [];
			 	this.ids = [];
			 	// 再次点击取消选中状态
			 	this.cancalSelectedStatus(index, keyid, item);
			 	// 获取当前点击的id
			 	this.getIds();
			 	// 点击规格，判断关联属性是否有库存
			 	let newDatas = this.getNewDataById(index, this.detailInfo.properties[index].currentIndex);
			 	this.getCurrentStock(index, this.detailInfo.properties[index].currentIndex, newDatas);
			 	this.detailInfo.properties = Object.assign([], this.detailInfo.properties);
			 },

			/*
			 * cancalSelectedStatus: 再次点击取消选中状态
			 */
			cancalSelectedStatus(index, keyid, item) {
				if (this.earlier) {
					if (this.earlier.id == item.id) {
						this.detailInfo.properties[index].currentIndex = this.detailInfo.properties[index].currentIndex ? '' : keyid;
					} else {
						this.detailInfo.properties[index].currentIndex = keyid;
					}
				} else {
					this.detailInfo.properties[index].currentIndex = keyid;
				}
				this.resetStock();
				this.earlier = Object.assign({}, item);
			},

			/*
			 * resetStock
			 */
			resetStock(){
				let properties = this.detailInfo.properties,
					len = properties.length;
				// 循环 最外层的属性
				for (let p = 0; p <= len - 1; p++ ) {
					if (!properties[p].currentIndex) {
						let attrs = properties[p].attrs;
						for (let a = 0; a <= attrs.length - 1; a++ ) {
							this.setIsHasStock(p, attrs[a].id, attrs[a]);
						}
					}
				}
			},

			/*
			 * getNewDataById: 根据id获取数据
			 */
			getNewDataById(index, currentid) {
				if (currentid) {
					let data = this.detailInfo.stock,
						newData = [];
					for (let i = 0; i <= data.length-1; i++) {
						this.setPriceByProperty(data[i]);
						let goods_attr = data[i].goods_attr.split('|');
						for (let j = 0; j <= goods_attr.length-1; j++) {
							if (goods_attr[j] == currentid && j == index) {
								newData.push(data[i]);
							}
						}
					}
					return newData;
				}
			},

			/*
			 * getCurrentStock: 获取当前
			 */
			getCurrentStock(index, currentid, newDatas) {
				if (newDatas) {
					let properties = this.detailInfo.properties;
					for (let i = 0; i <= properties.length-1; i++) {
						if (i != index) {
							//  循环每个属性下的规格
							let attrs = properties[i].attrs;
							for (let j = 0; j <= attrs.length-1; j++) {
								// 循环 库存
								let count = 0;
								for (let n = 0; n <= newDatas.length-1; n++) {
									if (newDatas[n].goods_attr.indexOf(''+attrs[j].id+'') >= 0 ) {
										count += newDatas[n].stock_number;
									}
								}
								if ( count > 0) {
									attrs[j].ishasstock = true;
								} else {
									attrs[j].ishasstock = false;
								}
							}
						}
					}
					this.detailInfo.properties = Object.assign([], this.detailInfo.properties);
				} else {
					// this.buildProperties(false);
				}
			},

			/*
			 * setPriceByProperty: 根据当前选择的规格获取价格
			 */
			setPriceByProperty(item) {
				if (this.ids.length != this.detailInfo.properties.length) {
					return;
				}
				let fromatIds = this.fromatArray('|', this.ids);
				if (item && item.goods_attr.indexOf(fromatIds) >= 0) {
					this.propertiPrice = item.goods_attr_price;
				}
			},

			/*
			 * getIds: 获取选中的id
			 */
			 getIds() {
			 	let data = this.detailInfo.properties;
			 	for (let i = 0, len = data.length-1; i <= len; i++) {
			 		if (data[i].currentIndex) {
			 			this.ids[i] = data[i].currentIndex;
			 		}
					for (let j = 0; j <= data[i].attrs.length -1; j++) {
						if (data[i].attrs[j].id == data[i].currentIndex) {
							this.info.push(data[i].attrs[j].attr_name);
						}
					}
				}
				let info = {
					'specification': this.info,
					'ids': this.ids
				};
				this.saveChooseInfo(info);
			},

			/*
			 * fromatArray: 格式化数组
			 */
			 fromatArray(delimiter, arrays) {
			 	let data = '';
			 	if (delimiter) {
			 		data = arrays.join(delimiter);
			 	}
			 	return delimiter ? data : arrays;
			 },

			/*
			 * isHasStock: 是否还有库存
			 */
			 isHasStock(id) {
			 	let data = this.detailInfo.stock;
			 	if (data.length > 0) {
			 		for (let i = 0, len = data.length; i <= len -1; i++) {
			 			if (data[i].goods_attr == id) {
			 				return ''+data[i].stock_number+'';
			 			}
			 		}
			 	}
			}
		}
	}
</script>

<style lang='scss' scoped>

.mint-popup-bottom {
	overflow: initial;
	height: 70%;
}
.ui-add-shopping {
	/* position: fixed;
	top: 0px;
	bottom: 0px;
	left: 0px;
	right: 0px;
	width: 100%;
	height: 100%; */
	/* z-index: 200; */
	/* background:rgba(0,0,0, 0.4); */
	.shopping-info {
		background:rgba(255,255,255,1);
		height: 100%;
		position: absolute;
		width: -webkit-fill-available;
		/* bottom: 0px; */
		z-index: 10;
		width: 100%;
		.info-header {
			padding: 15px;
			display: flex;
			justify-content: flex-start;
			padding-bottom: 25px;
			border-bottom: 0.5px solid rgba(232,234,237,1);
			img.info-image{
				width:120px;
				height:120px;
				border-radius: 1px;
				margin-top: -15px;
				position: absolute;
				top: -13px;
			}
			div {
				padding-left: 135px;
				width: 100%;
				span{
					display: block;
					color: #8F8E94;
					&:first-child {
						font-size:18px;
						line-height:20px;
						padding-bottom: 12px;
						color:rgba(239,51,56,1);
					}
					&:nth-child(2) {
						img {
							vertical-align: middle;
							padding-right: 10px;
							width: 50px;
							height: 20px;
						}
						span {
							display: inline;
							font-size:14px;
							line-height:14px;
							padding-bottom: 9px;
							padding-top: 12px;
						}
					}
					&:last-child {
						line-height: 20px;
						font-size:14px;
						line-height:20px;
						padding-top: 12px;
						width: 100%;
					    overflow: hidden;
					    text-overflow: ellipsis;
					    white-space: nowrap;
					    padding-right: 15px;
					}
				}
			}
			img.close {
				position: absolute;
				top: 15px;
				right: 15px;
				width: 13px;
				height: 13px;
				cursor: pointer;
				opacity:  1;
			}
		}
		div.goods-detail-properties {
    		width: 100%;
			overflow: auto;
			height: auto;
			position: absolute;
			top: 104px;
			bottom: 44px;
			/* height: 100%; */
		}
		div.goods-properties {
			padding: 30px 0px 0px 0px;
			p {
				font-size:16px;
				color:rgba(41,43,45,1);
				line-height:16px;
				margin: 0px;
				padding: 0px 15px;
			}
			div.properties-list{
				div {
					display: inline-block;
					margin-left: 15px;
					span {
						font-size:14px;
						color:rgba(78,84,93,1);
						line-height:14px;
						display: inline-block;
						padding: 7px 14px;
						border: 1px solid #404245;
						border-radius: 2px ;
						cursor: pointer;
						margin-top: 15px;
						&.active-properties{
							background:rgba(239,51,56,1);
							color:rgba(255,255,255,1);
							border: 1px solid #EF3338;
						}
						&.disabled-properties {
							color: #B1B5BB;
							cursor: none;
							border: 1px solid #A2A6AD;
						}
					}
				/* &:nth-child(even) {
					margin-left: 15px;
					} */
				}
			}
		}
		.info-body {
			padding: 15px 15px 20px 15px;
			p {
				font-size:16px;
				color:rgba(41,43,45,1);
				line-height:16px;
				padding: 0px;
				margin: 0px;
				padding-bottom: 9px;
			}
			div.ui-number{
				height: 30px;
				ul {
					list-style: none;
					height: 28px;
					line-height: 28px;
					text-align: left;
					color: #404245;
					overflow: hidden;
					padding: 0px;
					margin:  0px;
					input{
						height: 100%;
						padding: 0px;
						margin:  0px;
						border:  0px;
						outline-offset: 0px;
						text-shadow: none;
					}
					li {
						display: inline-block;
						width: 30px;
					    text-align: center;
					    float: left;
						img {
							width: 100%;
							height: 100%;
						}
						input {
							width: 40px;
							height: 27px;
							text-align: center;
							border: 0.5px solid #404245;
							border-radius: 0px;
							border-image-width: 0px;
							box-shadow: 0px;
							vertical-align: bottom;
							border-left: 0px;
		    				border-right: 0px;
							&:focus {
								outline: none;
							}
						}
						&:nth-child(2) {
							width: auto;
						}
					}
				}
			}
		}
		.info-footer {
			height:44px;
			background:rgba(239,51,56,1);
			line-height: 44px;
			text-align: center;
			font-size:16px;
			color:rgba(255,255,255,1);
			width: 100%;
			position: fixed;
			bottom: 0px;
		}
	}
}
</style>
