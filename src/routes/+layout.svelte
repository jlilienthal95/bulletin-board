<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div id="layoutCont" role="application" class="bg-[url(/bulletinbg.jpg)]">
	<div id="header">

	</div>
	{@render children()}
</div>
