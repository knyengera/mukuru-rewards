"use client";

import { useState } from "react";

export type CurrencyOption = {
  code: string;
  label: string;
};

export type ReceiveMethodOption = {
  value: string;
  label: string;
};

export type SendMoneyWidgetProps = {
  sourceCurrencies?: CurrencyOption[];
  targetCurrencies?: CurrencyOption[];
  receiveMethods?: ReceiveMethodOption[];
  onCalculate?: (params: {
    sendAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    receiveMethod: string;
  }) => void;
  // Optional enhanced API: overrides button label and submit handler if provided
  buttonLabel?: string;
  onSubmit?: (params: {
    sendAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    receiveMethod: string;
  }) => void;
};

const DEFAULT_SOURCE: CurrencyOption[] = [
  { code: "ZAR", label: "South Africa (ZAR)" },
  { code: "BWP", label: "Botswana (BWP)" },
  { code: "GBP", label: "United Kingdom (GBP)" },
];

const DEFAULT_TARGET: CurrencyOption[] = [
  { code: "USD", label: "United States Dollar (USD)" },
  { code: "ZWL", label: "Zimbabwe Dollar (ZWL)" },
  { code: "MWK", label: "Malawi Kwacha (MWK)" },
];

const DEFAULT_METHODS: ReceiveMethodOption[] = [
  { value: "cash", label: "Cash Pickup" },
  { value: "mobile", label: "Mobile Wallet" },
  { value: "bank", label: "Bank Account" },
];

export default function SendMoneyWidget({
  sourceCurrencies = DEFAULT_SOURCE,
  targetCurrencies = DEFAULT_TARGET,
  receiveMethods = DEFAULT_METHODS,
  onCalculate,
  buttonLabel,
  onSubmit,
}: SendMoneyWidgetProps) {
  const [sendAmount, setSendAmount] = useState<string>("");
  const [sendCurrency, setSendCurrency] = useState<string>(sourceCurrencies[0]?.code ?? "ZAR");
  const [receiveCurrency, setReceiveCurrency] = useState<string>(targetCurrencies[0]?.code ?? "USD");
  const [receiveMethod, setReceiveMethod] = useState<string>(receiveMethods[0]?.value ?? "cash");

  function handleCalculate() {
    const amount = Number(sendAmount || 0);
    const payload = {
      sendAmount: amount,
      sendCurrency,
      receiveCurrency,
      receiveMethod,
    };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      onCalculate?.(payload);
    }
  }

  return (
    <div className="w-full rounded-3xl bg-white p-5 text-neutral-900 shadow-xl">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700">You send</label>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Enter amount"
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
            />
            <select
              className="rounded-xl border border-neutral-200 bg-white px-2 py-2 text-sm"
              value={sendCurrency}
              onChange={(e) => setSendCurrency(e.target.value)}
            >
              {sourceCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700">They receive</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              placeholder="Auto-calculated"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
            />
            <select
              className="rounded-xl border border-neutral-200 bg-white px-2 py-2 text-sm"
              value={receiveCurrency}
              onChange={(e) => setReceiveCurrency(e.target.value)}
            >
              {targetCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700">Receive method</label>
          <div className="mt-1">
            <select
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
              value={receiveMethod}
              onChange={(e) => setReceiveMethod(e.target.value)}
            >
              {receiveMethods.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-[11px] text-neutral-500">Prices may vary slightly at time of order</p>

        <button
          className="w-full rounded-full bg-[#E85A3B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d74f33]"
          onClick={handleCalculate}
        >
          {buttonLabel ?? 'Calculate'}
        </button>
      </div>
    </div>
  );
}


