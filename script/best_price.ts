  const bestPriceProvider = React.useMemo(() => {
    if (availableProviders.length <= 1) return null;

    const providers = [
      {
        provider: SwapProvider.RELAY,
        amount: relayQuoteOptions[selectedQuoteOptionIndex]?.toAmount
      },
      {
        provider: SwapProvider.UNISWAP,
        amount: uniswapQuoteOptions[selectedQuoteOptionIndex]?.toAmount
      },
      {
        provider: SwapProvider.ZEROEX,
        amount: aggregatorQuoteOptions[selectedQuoteOptionIndex]?.toAmount
      },
      {
        provider: SwapProvider.JUPITER,
        amount: aggregatorQuoteOptions[selectedQuoteOptionIndex]?.toAmount
      }
    ].filter(p => p.amount && availableProviders.includes(p.provider));

    return providers.reduce((best, curr) => {
      if (curr.amount.gt(best.amount)) {
        return curr;
      }
      if (curr.amount.eq(best.amount)) {
        // Use PROVIDER_PRIORITY as tiebreaker
        const currIndex = PROVIDER_PRIORITY.indexOf(curr.provider);
        const bestIndex = PROVIDER_PRIORITY.indexOf(best.provider);
        return currIndex < bestIndex ? curr : best;
      }
      return best;
    }).provider;
  }, [
    availableProviders,
    relayQuoteOptions,
    uniswapQuoteOptions,
    aggregatorQuoteOptions,
    selectedQuoteOptionIndex
  ])

