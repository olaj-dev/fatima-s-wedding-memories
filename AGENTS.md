<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep wedding content centralized in `src/lib/wedding.ts` so dates and event details stay consistent across pages.
- RSVP submission mapping lives in `src/lib/rsvp.ts`; store the selected guest side in the existing `full_name` field to preserve submission compatibility without a schema change.
