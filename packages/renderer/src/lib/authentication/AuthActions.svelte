<script lang="ts">
import { faKey, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';

import { authenticationProviders } from '../../stores/authenticationProviders';
</script>

<DropdownMenu.Item
  title="Manage authentication"
  icon={faKey}
  onClick={() => (window.location.href = '#/preferences/authentication-providers')} />

{#each $authenticationProviders as provider}
  {@const sessionRequests = provider.sessionRequests ?? []}
  {#if provider?.accounts?.length > 0}
    {#each provider.accounts as account}
      <DropdownMenu.Item
        title={'Sign out of ' + account.label}
        onClick={() => window.requestAuthenticationProviderSignOut(provider.id, account.id)}
        icon={faSignOut} />
    {/each}
  {/if}

  {#each sessionRequests as request}
    <DropdownMenu.Item
      title="Sign in to use {request.extensionLabel}"
      onClick={() => window.requestAuthenticationProviderSignIn(request.id)}
      icon={faSignIn} />
  {/each}
{/each}
