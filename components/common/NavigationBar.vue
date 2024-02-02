<script setup lang="ts">
const menus = [{
  label: 'Profile',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  badge: 100
}, {
  label: 'Installation',
  icon: 'i-heroicons-home',
  to: '/getting-started/installation'
}, {
  label: 'Vertical Navigation',
  icon: 'i-heroicons-chart-bar',
  to: '/navigation/vertical-navigation'
}, {
  label: 'Command Palette',
  icon: 'i-heroicons-command-line',
  to: '/navigation/command-palette'
}]
</script>

<template>
  <div class="flex">
    <div class="flex flex-col items-stretch px-5">
      <div class="text-white text-xl leading-6 uppercase w-full -mr-5">menu</div>
      <div v-for="menu in menus" class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-7">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
            style="visibility: hidden"
        />
        <div class="text-white text-xl leading-6 uppercase self-center grow whitespace-nowrap my-auto">
          summary
        </div>
      </div>
      <div class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-6">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
        />
        <div class="text-white text-xl leading-6 uppercase self-center grow whitespace-nowrap my-auto">
          users
        </div>
      </div>
      <div class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-6">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
        />
        <div class="text-white text-xl leading-6 uppercase self-center grow whitespace-nowrap my-auto">
          risk manager
        </div>
      </div>
      <div class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-6">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
        />
        <div class="text-white text-xl leading-6 uppercase self-center grow whitespace-nowrap my-auto">
          epoch
        </div>
      </div>
      <div class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-6">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
        />
        <div class="text-white text-xl leading-6 uppercase self-center grow whitespace-nowrap my-auto">
          zeUSD
        </div>
      </div>
      <div class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-6">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
        />
        <div class="text-white text-xl leading-6 uppercase self-center grow whitespace-nowrap my-auto">
          emergency
        </div>
      </div>
      <div class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-5">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
        />
        <div class="text-white text-xl leading-6 uppercase grow whitespace-nowrap mt-1 self-start">
          DEX pool
        </div>
      </div>
      <div class="flex w-full items-stretch justify-between gap-3 -mr-5 mt-6">
        <img
            loading="lazy"
            src="@/assets/image/icon/navi_star.png"
            class="aspect-square object-contain object-center w-[19px] fill-white overflow-hidden shrink-0 max-w-full"
            alt=""/>
        <div class="text-white text-xl leading-6 uppercase self-center grow whitespace-nowrap my-auto">
          settings
        </div>
      </div>
    </div>
    <slot/>
  </div>
</template>

<style scoped>

</style>
