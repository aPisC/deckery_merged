export default {
  CardAmountSelector: (original) => ({
    type: 'PromptModal',
    title: 'Amount of cards',
    buttons: [
      ...(original.selectAll
        ? [{ text: 'All', onClick: original.selectAll }]
        : []),
    ],
    default: '1',
    inputProps: {
      type: 'number',
      min: 1,
    },
  }),
};
