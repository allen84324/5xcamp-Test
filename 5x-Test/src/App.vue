<script setup></script>

<template>
	<div>
		<div>
			<h1>台灣銀行代碼查詢</h1>
			<div>
				<h3>銀行名稱</h3>
				<input type="text" />
			</div>
			<div>
				<h3>分行名稱</h3>
				<input type="text" />
			</div>
			<p>可使用下拉選單或直接輸入關鍵字查詢</p>
		</div>
		<div>
			<h2>{銀行名稱}</h2>
			<div>
				<h3>分行代碼:{XX}</h3>
			</div>
			<div>
				<h3>地址：{XX}</h3>
			</div>
			<div>
				<h3>電話：{XX}</h3>
			</div>
		</div>
		<div>
			<button>重新查詢</button>
			<button>複製此頁面連結</button>
		</div>
	</div>
</template>

<style scoped></style>
