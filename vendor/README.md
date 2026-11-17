# Reviewed build-tool security backport

This is an explicitly named, private MIT-licensed fork of picomatch4.0.7. It is not an official upstream release. The frontend, UI, training engines and stored data are unchanged.

The archive contains upstream runtime files and license, plus the patch in picomatch-security.patch. Provenance records upstream tag commit6bb40679c218cefba5d4e9662408c5fdf699a8bb, proposed fix PR237 commit1bf0d04563cb9ce568cf36efc5f6b7187d9911d5, installed-file hashes and archive hash. Original copyright/license is retained in the archive. The upstream MIT license permits modification and redistribution.

The patch collapses a slash-free single repeated branch containing a bare star to one occurrence (optional for the outer star). Such a branch already matches its own concatenations; removing the redundant outer repetition prevents exponential backtracking. A local extension also handles consecutive bare stars: the proposed fix alone leaves +(**a) vulnerable. Other parser logic is unchanged. The inherited maxExtglobRecursion:false opt-out remains unsafe and is not used by this project's tools.

Original +(*a) against64 repeated characters times out in a subprocess. Patched attack regressions must finish within3seconds, across the platform/dot/bash/capture options used in testing. The full upstream4.0.7 suite ran through Node's built-in test API:1983 passed, zero skipped, zero failed. Its only auxiliary test dependency, fill-range7.1.1, is isolated under ignored artifacts; it is not an application dependency.

npm audit does not inspect vendored code and is not sufficient proof of this fix. The project additionally verifies every installed fork file, the archive hash, exploit regressions and upstream advisory metadata. Unrecognized upstream advisories must fail the security gate. The existing npm audit severity threshold stays unchanged; there is no publication exception.

Regeneration: obtain the exact upstream4.0.7 package, apply the tracked patch, use the package manifest from the archive (including scoped identity/provenance), then npm pack with lifecycle scripts disabled. Review source and update hashes before using a changed archive. Never relabel the unpatched package as a fixed upstream release. Replace this backport with an official fixed release once verified.

Sources: https://github.com/micromatch/picomatch/tree/4.0.7 , https://github.com/micromatch/picomatch/pull/237 , https://github.com/advisories/GHSA-fc5q-39xc-vjpf .
