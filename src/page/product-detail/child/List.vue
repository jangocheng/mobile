<!-- List.vue -->
<template>
	<div class="ui-review-list">
		<div class="list" v-for="(item, index) in list">
			<div>
				<span>
					{{ utils.replaceStr(item.author.username) }}
					<span v-bind:class="{'good-review': item.grade == 3, 'medium-review': item.grade == 2, 'bad-review': item.grade == 1}">{{ getGrade(item.grade) }}</span>
				</span>

				<span>{{ getTime(item.created_at)}}</span>
			</div>
			<p v-if="item.content"> {{ item.content }}</p>
			<p v-if="!item.content">无评价信息</p>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return {}
	},

	props: ['list'],

	created(){},

	methods: {
		/*
			getGrade: 获取评论的等级
			@params： grade 等级
		 */
		getGrade(grade) {
			if (grade == 1) {
				return '差评';
			} else if (grade == 2) {
				return '中评';
			} else {
				return '好评';
			}
		},

		/*
			getTime: 获取评论的时间
			@params: timestamps 时间戳
		 */
		getTime(timestamps) {
			let date = new Date(timestamps * 1000);
			let year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate();
			return  year + '-' + month + '-' + day;
		}
	}
}
</script>

<style lang="scss">
.ui-review-list{
	background:rgba(255,255,255,1);
	.list{
		padding: 15px 0px;
		border-bottom: 0.5px solid #e8eaed;
		color: #4E545D;
		font-size: 15px;
		div {
			overflow: hidden;
			padding-bottom: 15px;
			display: flex;
			justify-content: space-between;
			align-content: center;
			align-items: center;
			span {
				&:first-child {
					display: flex;
					justify-content: space-around;
					align-content: center;
					align-items: center;
					span {
						margin-left: 15px;
						color: #FFFFFF;
						font-size: 12px;
					}
				}
				&:last-child {
					color:#8F8E94;
					font-size: 12px;
				}
				&.good-review {
					background: url('../../../assets/image/change-icon/b0_comment_good@2x.png') no-repeat;
					width:36px;
					height:16px;
					text-align:center;
					background-size:cover;
					line-height: 16px;
				}
				&.medium-review {
					background: url('../../../assets/image/change-icon/b0_comment_middle@2x.png') no-repeat;
					width:36px;
					height:16px;
					text-align:center;
					background-size:cover;
					line-height: 16px;
				}
				&.bad-review {
					background: url('../../../assets/image/change-icon/b0_comment_bad@2x.png') no-repeat;
					width:36px;
					height:16px;
					text-align:center;
					background-size:cover;
					line-height: 16px;
				}
			}
		}
		p {
			padding: 0px;
			margin: 0px;
			flex-basis: 100%;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}
}
</style>
