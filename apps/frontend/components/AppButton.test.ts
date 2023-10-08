import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";
import { VueWrapper, shallowMount } from "@vue/test-utils";
import AppButton from "./AppButton.vue";

describe("AppButton", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = shallowMount(AppButton);
  });

  test("renders correctly for type 'link'", () => {
    wrapper.setProps({ type: "link" });
    expect(wrapper.find("nuxt-link").exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(false);
  });

  test("doesn't have loading spinner when loading prop is false", () => {
    wrapper.setProps({ loading: false });
    expect(wrapper.find(".loading-spinner").exists()).toBe(false);
  });

  test("emits click event", async () => {
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });

  afterEach(() => {
    wrapper.unmount();
  });
});
