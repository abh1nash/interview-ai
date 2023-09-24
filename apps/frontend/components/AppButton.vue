<script setup lang="ts">
interface ButtonProps {
  /**
   * Whether the button should be round
   * @type {boolean}
   */
  round?: boolean;
  /**
   * Whether the button should be square
   * @type {boolean}
   */
  square?: boolean;
  /**
   * Create button without background color
   * @type {boolean}
   */
  flat?: boolean;
  /**
   * Create a flat button with soft primary color
   * @type {boolean}
   */
  flatPrimary?: boolean;
  /**
   * Create a button with outline
   * @type {boolean}
   */
  outline?: boolean;
  /**
   * Create a button that indicates a destructive action.
   *
   * Basically, a red button.
   * @type {boolean}
   */
  destructive?: boolean;
  /**
   * Whether the button should be disabled
   * @type {boolean}
   */
  disabled?: boolean;
  /**
   * Whether the button should have a loading indicator
   * @type {boolean}
   */
  loading?: boolean;
  /**
   * The size of the button
   * @default md
   * @values xs, sm, md, lg
   */
  size?: "xs" | "sm" | "md" | "lg";
  /**
   * The type of the button.
   *
   * If `link` is used, the button will be rendered as a `nuxt-link`.
   * Else, it will be rendered as a `button`.
   * @default link
   * @values link, button, submit, reset
   */
  type?: "link" | "button" | "submit" | "reset";
  /**
   * The link to which the button should navigate.
   *
   * Accepts the same options as `nuxt-link`.
   *
   * Only used when `type` is `link`.
   * @optional
   * @type {string | Record<string, unknown>}
   */
  to?: string | Record<string, unknown>;
}
const props = withDefaults(defineProps<ButtonProps>(), {
  type: "link",
  size: "md",
  disabled: false,
});

const {
  round,
  square,
  flat,
  flatPrimary,
  outline,
  disabled,
  loading,
  size,
  type,
  to,
  destructive,
} = toRefs(props);
const emit = defineEmits<{
  /**
   * The event emitted when the button is clicked
   * @param {MouseEvent | TouchEvent} v - The event object
   */
  (e: "click", v: MouseEvent | TouchEvent): void;
}>();

const sizeClass = computed(() => {
  const sizeMap = { xs: "btn-xs", sm: "btn-sm", md: "btn-md", lg: "btn-lg" };
  return sizeMap[size.value];
});
const btnClasses = computed(() => [
  `btn`,
  sizeClass.value,
  {
    [[
      "bg-gradient-to-tr",
      "from-blue-500",
      "border-blue-300",
      "hover:border-blue-200",
      "to-blue-500/50",
      "text-white",
      "shadow-blue-500/50",
      "hover:shadow-blue-500/75",
      "shadow-xl",
      "font-bold",
    ].join(" ")]:
      !flat.value &&
      !flatPrimary.value &&
      !outline.value &&
      !disabled.value &&
      !destructive.value,
  },
  {
    "bg-white shadow-red/50 hover:shadow-red-500/75 shadow-xl bg-gradient-to-tr from-red-500 to-red-500/75 text-white":
      destructive.value,
  },
  { "btn-circle": round.value },
  { "btn-square": square.value },
  { "btn-ghost": flat.value || flatPrimary.value },
  {
    "bg-blue-500/10 border-none hover:bg-gradient-to-tr hover:from-blue-500 hover:to-blue-500/25 hover:bg-white hover:text-white text-blue-500":
      flatPrimary.value,
  },
  { "btn-outline": outline.value },
  { "btn-disabled": disabled.value || loading.value },
]);
</script>
<template>
  <nuxt-link
    v-if="type == 'link'"
    :disabled="disabled ? disabled : undefined"
    :class="btnClasses"
    :to="to"
    @click="(e) => emit('click', e)"
  >
    <span v-if="loading" class="loading loading-spinner"></span>
    <slot></slot>
  </nuxt-link>
  <button
    v-else
    :disabled="disabled"
    :type="type"
    :class="btnClasses"
    @click="(e) => emit('click', e)"
  >
    <span v-if="loading" class="loading loading-spinner"></span>
    <slot></slot>
  </button>
</template>
