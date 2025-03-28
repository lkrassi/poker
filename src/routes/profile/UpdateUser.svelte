<script lang="ts">
	import UpdateProfilePic from './UpdateProfilePic.svelte';
	import UpdateUsername from './UpdateUsername.svelte';
</script>

<div class="update-user">
	<UpdateProfilePic />
	<UpdateUsername />
</div>

<style lang="scss">
	.update-user {
		display: flex;
		flex-direction: column;
		row-gap: 2rem;
	}
</style>
