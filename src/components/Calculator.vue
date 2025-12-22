<script setup lang="ts">
import { ref, computed } from 'vue';
import { options } from '../constants/options';
import { UiButton, UiInput, UiSelect, UiField } from '@danilovd/is-ui';
import { isIpValid } from '../functions/IsIpValid';
import { getNetworkAddress } from '../functions/getNetworkAddress';
import { getAddressesCount } from '../functions/getAddressesCount';

const ipAddress = ref('');
const selectedMask = ref(options[0] || '');

const result = ref<{
  ip: string;
  mask: string;
  networkAddress: string;
  hostsCount: number;
} | null>(null);


const cidrPrefix = computed(() => {
  const index = options.indexOf(selectedMask.value);
  return index !== -1 ? `/${32 - index}` : '';
});

const isFormValid = computed(() => isIpValid(ipAddress.value));

const handleCalculate = () => {
  if (!isFormValid.value) return;

  const network = getNetworkAddress(ipAddress.value, selectedMask.value);
  const count = getAddressesCount(selectedMask.value);

  result.value = {
    ip: ipAddress.value,
    mask: selectedMask.value,
    networkAddress: network,
    hostsCount: count,
  };
};
</script>

<template>
  <div class="calculator-layout">
    <div class="glass-card">
      <h2 class="title">Калькулятор <span>Подсетей</span></h2>

      <form @submit.prevent="handleCalculate" class="form">
        <div class="input-section">
          <UiField label="IP-адрес">
            <UiInput 
              v-model="ipAddress" 
              placeholder="192.168.1.150"
              :class="{ 'input-error': !isFormValid && ipAddress.length > 0 }" 
            />
            <p v-if="!isFormValid && ipAddress.length > 0" class="error-text">
              Некорректный формат IP-адреса
            </p>
          </UiField>

          <div class="mask-field-wrapper">
            <UiField label="Маска сети">
              <div class="select-with-badge">
                <UiSelect v-model="selectedMask" :options="options" />
                <span class="cidr-badge">{{ cidrPrefix }}</span>
              </div>
            </UiField>
          </div>
        </div>

        <UiButton
          layout="primary"
          type="submit"
          :is-disabled="!isFormValid"
          class="submit-btn"
        >
          Рассчитать параметры
        </UiButton>
      </form>

      <div v-if="result" class="results-box">
        <div class="result-row">
          <span class="label">Адрес сети:</span>
          <span class="value">{{ result.networkAddress }}</span>
        </div>
        <div class="result-row">
          <span class="label">Количество хостов:</span>
          <span class="value accent">{{ result.hostsCount }}</span>
        </div>
        <div class="footer-info">
          <span>IP: {{ result.ip }}</span>
          <span>Mask: {{ result.mask }} ({{ cidrPrefix }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calculator-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f0f2f5;
  padding: 20px;
}

.glass-card {
  background: var(--color-white);
  width: 100%;
  max-width: 550px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px var(--color-primary-light)
}

.title {
  text-align: center;
  font-size: 24px;
  color: var(--color-black);
  margin-bottom: 30px;
  span { color: var(--color-primary); }
}

.input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
}

.select-with-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.cidr-badge {
  white-space: nowrap;
  color: var(--color-primary); 
  font-weight: 500;
}

.select-with-prefix {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.submit-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 12px;
}

.results-box {
  margin-top: 30px;
  padding: 20px;
  background: var(--color-white);
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
}

.result-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .label { color: var(--color-gray-dark); font-weight: 500; }
  .value { font-weight: 700; color: var(--color-black); }
  .value.accent { color: var(--color-primary); }
}

.footer-info {
  margin-top: 15px;
  display: flex;
  gap: 15px;
  font-size: 14px; 
  font-weight: 500;
  color: var(--color-gray-dark);
  border-top: 1px solid var(--color-gray-dark);
  padding-top: 10px;
}

.input-error {
  :deep(.ui-input) { 
    border-color: var(--color-error) !important;
  }
}

.error-text {
  color: var(--color-error);
  font-size: 12px;
  margin-top: 4px;
}


</style>