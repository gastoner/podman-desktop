<script lang="ts">
import { faKey, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu } from '@podman-desktop/ui-svelte';

import AccountIcon from '/@/lib/images/AccountIcon.svelte';
import { handleNavigation } from '/@/navigation';
import { authenticationProviders } from '/@/stores/authenticationProviders';
import { NavigationPage } from '/@api/navigation-page';

export let iconSize: string;
</script>

<DropdownMenu class="text-[var(--pd-action-button-text)]">
  <svelte:fragment slot="icon">
    <AccountIcon size={iconSize} />
  </svelte:fragment>

  <DropdownMenu.Item
    title="Manage authentication"
    icon={faKey}
    onClick={() => handleNavigation({ page: NavigationPage.AUTHENTICATION })} />

  {#each $authenticationProviders as provider}
    {@const sessionRequests = provider.sessionRequests ?? []}
    {#if provider?.accounts?.length > 0}
      {#each provider.accounts as account}
        <DropdownMenu.Item
          title="Sign out of {provider.displayName} ({account.label})"
          onClick={() => window.requestAuthenticationProviderSignOut(provider.id, account.id)}
          icon={faSignOut} />
      {/each}
    {/if}

    {#each sessionRequests as request}
      <DropdownMenu.Item
        title="Sign in with {provider.displayName} to use {request.extensionLabel}"
        onClick={() => window.requestAuthenticationProviderSignIn(request.id)}
        icon={faSignIn} />
    {/each}
  {/each}
</DropdownMenu>
