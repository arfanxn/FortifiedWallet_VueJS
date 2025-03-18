<template>
  <li
    class="grid w-full cursor-pointer gap-x-4 px-4 py-2 transition-all duration-200 hover:bg-slate-400 hover:text-slate-800 md:grid-cols-12"
  >
    <div class="flex flex-col gap-y-1 overflow-hidden text-sm break-all md:col-span-7">
      <div class="inline-flex items-center gap-x-2 font-semibold">
        <FontAwesomeIcon :icon="faHashtag" class="w-4 text-sm" />
        <span @mouseenter="isHashHovered = true" @mouseleave="isHashHovered = false">{{
          isHashHovered ? transaction.hash : formatEthHash(transaction.hash)
        }}</span>
      </div>

      <div class="inline-flex items-center gap-x-2">
        <div
          class="inline-flex items-center gap-x-2"
          v-show="!isToHovered"
          @mouseenter="isFromHovered = true"
          @mouseleave="isFromHovered = false"
        >
          <FontAwesomeIcon :icon="faArrowRightArrowLeft" class="w-4 text-sm" />
          <span class="font-semibold">
            {{ isFromHovered ? props.wallet.address : formatEthAddr(props.wallet.address) }}
          </span>
        </div>
        <div
          class="inline-flex items-center gap-x-2"
          v-show="!isFromHovered"
          @mouseenter="isToHovered = true"
          @mouseleave="isToHovered = false"
        >
          <FontAwesomeIcon :icon="faArrowRightLong" class="w-4 text-sm" />
          <span class="font-semibold">
            {{ isToHovered ? transaction.to : formatEthAddr(transaction.to) }}
          </span>
        </div>
      </div>

      <div class="inline-flex items-center gap-x-2 font-semibold">
        <FontAwesomeIcon :icon="faCoins" class="w-4 text-sm" />
        <span @mouseenter="isTokenHovered = true" @mouseleave="isTokenHovered = false">
          {{
            isTokenTransaction
              ? `${isTokenHovered ? transaction.token : formatEthAddr(transaction.token)} (${tokenMetadata?.symbol ?? '?'})`
              : `ETH`
          }}
        </span>
      </div>

      <div class="font-semibold" @mouseleave="isApproversHovered = false">
        <div class="inline-flex items-center gap-x-2" @mouseenter="isApproversHovered = true">
          <FontAwesomeIcon :icon="faUserCheck" class="w-4 text-sm" />
          <span>
            {{ `Approved by ${transaction.approvalCount} of ${wallet.signers.length} signers` }}
          </span>
        </div>
        <ul class="ml-6 flex flex-col gap-y-0.5" v-show="isApproversHovered">
          <li
            class="flex gap-x-2 font-mono"
            v-for="(signer, index) in transaction.approvers"
            :key="index"
          >
            <span class="min-w-[1rem]">{{ index + 1 }}.</span>
            <span class="break-all whitespace-pre-wrap">{{ signer }}</span>
          </li>
        </ul>
      </div>

      <div class="flex items-center gap-x-2 font-semibold">
        <FontAwesomeIcon :icon="faHourglassHalf" class="w-4 text-sm" />
        <span>{{ transactionStatus }}</span>
      </div>
    </div>

    <div
      class="flex flex-row-reverse justify-between gap-y-1 overflow-hidden text-sm break-all md:col-span-5"
    >
      <div class="flex gap-x-0.5 font-semibold">
        <span class="break-words">
          {{
            `${
              transaction.token === ethers.ZeroAddress
                ? ethers.formatUnits(transaction.value, 18)
                : ethers.formatUnits(transaction.value, tokenMetadata?.decimals)
            } ${transaction.token === ethers.ZeroAddress ? 'ETH' : (tokenMetadata?.symbol ?? '(?)')}`
          }}
        </span>
        <span>
          (<FontAwesomeIcon :icon="faDollarSign" class="text-sm" />{{
            `${formatUsd(transaction.valueInUsd)}`
          }})
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm font-semibold md:col-span-full">
      <div class="flex items-center gap-x-2">
        <FontAwesomeIcon :icon="faCalendar" class="w-4 text-sm" />
        <span>{{
          `Created at ${moment.unix(Number(transaction.createdAt)).format('DD-MM-YYYY HH:mm')}`
        }}</span>
      </div>

      <div class="flex items-center justify-end gap-x-2" v-show="isHovered">
        <ButtonC
          v-if="isTransactionPending"
          @onClick="() => handleTransactionActionSubmission('cancel')"
          type="button"
          :text="'Cancel'"
          class="bg-red-700! text-slate-200! outline-slate-300! hover:bg-red-600! hover:text-slate-100!"
        />
        <ButtonC
          v-if="isTransactionApprovedByCurrentSigner && isTransactionPending"
          @onClick="() => handleTransactionActionSubmission('revoke')"
          type="button"
          :text="'Revoke'"
          class="bg-amber-700! text-slate-200! outline-slate-300! hover:bg-amber-600! hover:text-slate-100!"
        />
        <ButtonC
          v-if="!isTransactionApprovedByCurrentSigner && isTransactionPending"
          @onClick="() => handleTransactionActionSubmission('approve')"
          type="button"
          :text="'Approve'"
          class="bg-green-700! text-slate-200! outline-slate-300! hover:bg-green-600! hover:text-slate-100!"
        />
        <ButtonC
          v-if="isTransactionPending"
          @onClick="() => handleTransactionActionSubmission('execute')"
          type="button"
          :text="'Execute'"
          class="outline-slate-300!"
        />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ButtonC from '@/components/ButtonC.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { useTokenMetadataFetch } from '@/composables/tokens/useTokenMetadataFetch'
import { Transaction } from '@/interfaces/transactionInterfaces'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import {
  faArrowRightArrowLeft,
  faArrowRightLong,
  faCalendar,
  faCoins,
  faDollarSign,
  faHashtag,
  faHourglassHalf,
  faMinus,
  faEquals,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons'
import { formatEthAddr, formatEthHash, formatUsd } from '@/helpers/stringHelpers'
import { Wallet } from '@/interfaces/walletInterfaces'
import { ethers } from 'ethers'
import { areSameEthAddrs, isZeroEthAddr } from '@/utils/booleanUtils'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useRouter } from 'vue-router'
import { RouteName } from '@/enums/routeEnums'
import { useTransactionNavigator } from '@/composables/transactions/useTransactionNavigator'

library.add(
  faArrowRightArrowLeft,
  faArrowRightLong,
  faCalendar,
  faCoins,
  faDollarSign,
  faHashtag,
  faHourglassHalf,
  faMinus,
  faEquals,
  faUserCheck,
)

const props = defineProps<{
  wallet: Wallet
  transaction: Transaction
  isHovered: boolean
}>()

const router = useRouter()
const ethereumStore = useEthereumStore()

const isHashHovered = ref(false)
const isFromHovered = ref(false)
const isToHovered = ref(false)
const isTokenHovered = ref(false)
const isApproversHovered = ref(false)

const isTokenTransaction = computed(() => isZeroEthAddr(props.transaction.token) === false)
const isTransactionExecuted = computed(() => props.transaction.executedAt !== 0n)
const isTransactionCancelled = computed(() => props.transaction.cancelledAt !== 0n)
const isTransactionPending = computed(
  () => !isTransactionExecuted.value && !isTransactionCancelled.value,
)
const transactionStatus = computed(() => {
  if (isTransactionExecuted.value)
    return `Executed at ${moment.unix(Number(props.transaction.executedAt)).format('DD-MM-YYYY HH:mm')}`
  else if (isTransactionCancelled.value)
    return `Cancelled at ${moment.unix(Number(props.transaction.cancelledAt)).format('DD-MM-YYYY HH:mm')}`
  else return 'Pending'
})
const isTransactionApprovedByCurrentSigner = computed(
  () =>
    props.transaction.approvers.filter((approver) =>
      areSameEthAddrs(approver, ethereumStore.activeAccount),
    ).length > 0,
)

const transactionStore = useTransactionStore()
const { navigateToTransactionIndex } = useTransactionNavigator()
const {
  fetchTransactionByHash,
  approveWalletTransaction,
  revokeWalletTransaction,
  cancelWalletTransaction,
  executeWalletTransaction,
} = useWalletInteraction()
const { tokenMetadata, fetchTokenMetadata } = useTokenMetadataFetch()

onMounted(async () => {
  // TODO: remove this temporary solution
  if (isTokenTransaction.value) await fetchTokenMetadata(props.transaction.token)
})

async function handleTransactionActionSubmission(
  action: 'approve' | 'revoke' | 'cancel' | 'execute',
) {
  try {
    const hash = props.transaction.hash
    let message: string

    switch (action) {
      case 'approve':
        await approveWalletTransaction(hash)
        message = `Transaction approved with transaction hash "${hash}".`
        break
      case 'revoke':
        await revokeWalletTransaction(hash)
        message = `Transaction revoked with transaction hash "${hash}".`
        break
      case 'cancel':
        await cancelWalletTransaction(hash)
        message = `Transaction cancelled with transaction hash "${hash}".`
        break
      case 'execute':
        await executeWalletTransaction(hash)
        message = `Transaction executed with transaction hash "${hash}".`
        break
    }

    showToast(ToastType.Success, message!, 15 * 1000)

    navigateToTransactionIndex({ transactionHash: hash })
  } catch (error) {
    const message = error instanceof Error ? error.message : `Failed to ${action} Transaction.`
    showToast(ToastType.Error, message)
  }
}
</script>
