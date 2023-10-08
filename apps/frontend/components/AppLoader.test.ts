import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { VueWrapper, shallowMount } from "@vue/test-utils";
import AppLoader from "./AppLoader.vue";

describe("AppLoader", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = shallowMount(AppLoader, { loading: false });
  });

  test("doesn't render when loading is false", () => {
    wrapper.setProps({ loading: false });
    const loadingDiv = wrapper.find(".loading.loading-dots");
    expect(loadingDiv.exists()).toBe(false);
  });

  afterEach(() => {
    wrapper.unmount();
  });
});
