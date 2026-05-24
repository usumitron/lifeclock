// lib/styles.ts

export const styles = {
  container: `
    min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center
    px-4 sm:px-8 gap-6 landscape:gap-3
    bg-white text-black
    dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800
    dark:text-white
  `,
  currentTimeAndBirthInput: `
    flex flex-col items-center gap-4
  `,
  langButton: `
    absolute top-4 right-4 max-h-[500px]:top-2 flex gap-2
  `,
  input: `
    border rounded-md px-3 py-2 max-h-[500px]:py-1
    text-base sm:text-lg max-h-[500px]:text-sm bg-white text-black
    focus:outline-none focus:ring-2 focus:ring-blue-400
  `,
  span: `
    cursor-pointer px-2 py-1 rounded-md
    transition-all duration-200 hover:bg-gray-200 hover:text-black
    dark:hover:bg-white dark:hover:text-black
  `,
  unitButton: (isActive: boolean) => `
    px-3 py-2 sm:px-4 sm:py-2 rounded-lg border transition-all duration-150 active:scale-95
    max-h-[500px]:py-1 max-h-[500px]:px-2 max-h-[500px]:text-xs
    ${
      isActive
        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
        : "bg-white text-black border-gray-300 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/30"
    }
  `
};