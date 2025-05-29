<script lang="ts">
	import Table from '../../features/table/ui/Table.svelte';

	interface PageData {
		lobbyId: string;
	}

	export let data: PageData;
</script>

<Table lobbyId={data.lobbyId} />
