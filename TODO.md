# Mobile Overlap Fix: Wallet & Wallet-Hierarchy Pages

## Steps (Approved Plan - Proceed Step-by-Step)

1. [ ] **Breakdown approved plan into TODO**: Create this TODO.md (done).
2. [ ] **Edit responsive.css**: Add mobile hero-grid fixes (@768px, @480px for .hero-grid, .hero-panel, .card-pad, .hero-actions).
3. [ ] **Edit layout.css**: Tweak .hero-panel max-width: none on small screens if needed.
4. [ ] **Clean wallet-hierarchy.html**: Remove/replace inline responsive styles with classes.
5. [ ] **Test wallet.html**: execute `cd atho.io && python runweb.py`, resize to 320px, verify no overlap in hero section.
6. [ ] **Test wallet-hierarchy.html**: Same as above.
7. [ ] **Sync ionos-upload**: Copy responsive.css changes if bundle script handles.
8. [ ] **Verify icons**: Check if icons fixed (user mentioned "fix the inons deploy as well" - confirm if icons ok).
9. [ ] **Deploy**: Run build_ionos_bundle.sh if needed.
10. [ ] **Mark complete**: Update TODO.md, attempt_completion with `open atho.io/wallet.html`.

5. [ ] **Test wallet.html**: User reports still overlapping at small widths. Enhanced mobile !important rules added to responsive.css @768px. Please retest at http://127.0.0.1:59884/wallet.html (resize to 350px). Step 6 test after confirmation.


