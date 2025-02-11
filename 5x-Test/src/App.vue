<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const banks = ref([])
const branches = ref([])

const selectedBank = ref('')
const selectedBranch = ref(null)
const linkCopied = ref(false)
const copied = ref(false)

const route = useRoute()
const router = useRouter()

const copyLink = () => {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(window.location.href).then(() => {
			linkCopied.value = true
			setTimeout(() => {
				linkCopied.value = false
			}, 2000)
		})
	}
}

const loadBranches = async (bankCode) => {
	try {
		const response = await axios.get(`/api/banks/${bankCode}/branches`)
		branches.value = response.data.branches
	} catch (error) {
		console.error('無法獲取分行資料：')
	}
}

const copyCode = () => {
	if (selectedBranch.value) {
		navigator.clipboard.writeText(selectedBranch.value.code)
		copied.value = true
		setTimeout(() => {
			copied.value = false
		}, 2000)
	}
}

const resetSelection = () => {
	selectedBank.value = ''
	selectedBranch.value = null
	branches.value = []
	router.push({ name: 'Home' })
}

onMounted(async () => {
	const response = await axios.get(`/api/banks`)
	banks.value = response.data.bank.sort((a, b) => {
		const codeA = parseInt(a.code, 10)
		const codeB = parseInt(b.code, 10)
		if (codeA === codeB) {
			return a.title.localeCompare(b.title)
		}
		return codeA - codeB
	})

	const bankCodeFromUrl = route.params.bankCode
	const branchCodeFromUrl = route.params.branchCode
	let branchNameFromUrl = route.params.branchName

	if (branchNameFromUrl) {
		branchNameFromUrl = decodeURIComponent(
			branchNameFromUrl.replace('.html', '')
		)
	}

	try {
		if (bankCodeFromUrl && branchCodeFromUrl && branchNameFromUrl) {
			selectedBank.value = bankCodeFromUrl
			await loadBranches(bankCodeFromUrl)

			selectedBranch.value = branches.value.find(
				(b) => b.code === branchCodeFromUrl && b.title === branchNameFromUrl
			)
		}
	} catch (error) {
		console.error('無法獲取銀行名稱：')
	}
})

watch(selectedBank, async (newBankCode) => {
	if (!newBankCode) {
		branches.value = []
		selectedBranch.value = null
		return
	}

	await loadBranches(newBankCode)
})

watch(selectedBranch, (newBranch) => {
	if (newBranch) {
		const branchNameEncoded = encodeURIComponent(newBranch.title)
		const formattedPath = `/${selectedBank.value}/${newBranch.code}/${newBranch.title}.html`
		router.push({ path: formattedPath })
	}
})
</script>

<template>
	<div class="container">
		<h1 class="title">台灣銀行代碼查詢</h1>
		<div class="card1">
			<div>
				<h3 class="subtitle">銀行名稱</h3>
				<select v-model="selectedBank" class="select">
					<option value="" disabled>請選擇銀行名稱</option>
					<option v-for="bank in banks" :key="bank.code" :value="bank.code">
						{{ bank.code }} - {{ bank.title }}
					</option>
				</select>
			</div>
			<div>
				<h3 class="subtitle">分行名稱</h3>
				<select
					v-model="selectedBranch"
					class="select"
					:disabled="!selectedBank"
				>
					<option value="" disabled>請選擇分行名稱</option>
					<option v-for="branch in branches" :key="branch.code" :value="branch">
						{{ branch.title }}
					</option>
				</select>
			</div>
		</div>
		<p>可使用下拉選單或直接輸入關鍵字查詢</p>

		<div v-if="selectedBranch" class="card2">
			<h2 class="subtitle">
				{{ banks.find((b) => b.code === selectedBank)?.title }}-{{
					selectedBranch.title
				}}
			</h2>
			<div class="code">
				<h3>分行代碼: {{ selectedBranch.code }}</h3>
				<button v-if="!copied" @click="copyCode">複製代碼</button>
				<button v-if="copied">已複製</button>
			</div>
			<div>
				<h3>地址：{{ selectedBranch.address }}</h3>
			</div>
			<div>
				<h3>電話：{{ selectedBranch.tel }}</h3>
			</div>
			<div class="copy">
				<button @click="resetSelection">重新查詢</button>
				<button v-if="!linkCopied" @click="copyLink" class="btn">
					複製此頁面連結
				</button>
				<button v-if="linkCopied">已複製</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	margin: 0 auto;
	padding: 20px;
}
.card1 {
	display: flex;
	gap: 10px;
}
.title {
	font-size: 40px;
}
.subtitle {
	font-size: 25px;
}
.select {
	font-size: 20px;
	width: 100%;
}
.card2 {
	background-color: rgb(11, 142, 218, 0.2);
	border: 1px solid black;
	border-radius: 10px;
	padding: 10px;
	margin-top: 10px;
}
.code {
	display: flex;
	gap: 10px;
}
.code button {
	border-radius: 9999px;
	padding: 5px;
	background-color: rgb(121, 255, 248);
}
.copy {
	display: flex;
	gap: 10px;
	margin-top: 10px;
}
.copy button {
	border-radius: 9999px;
	padding: 5px;
}
.copy .btn {
	background-color: rgb(121, 255, 248);
}
@media screen and (max-width: 900px) {
	.card1 {
		flex-direction: column;
	}
}
</style>
