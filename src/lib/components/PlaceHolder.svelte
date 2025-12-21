<script lang="ts">
  interface Props {
    width: number | null,
    height: number | null,
    customClass?: string
  }

  let { 
    width = 200,
    height = 200,
    customClass = ""
  }: Props = $props()


</script>

<div 
  class="bg-mocha-surface0 text-mocha-text select-none font-bold flex items-center justify-center rounded-xl {customClass}" 
	style="width:{width}px; height:{height}px;"
>
  {width} x {height}
</div>
