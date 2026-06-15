---
description: Drive tracking, swap targets, and handle errors from your own C#.
---

# Runtime API

For most projects you never touch the API - drop a `WebARImageTracker`, parent
content under it, and it shows and hides itself. The API is for apps that start
and stop tracking, swap targets, or surface their own AR UI.

Everything routes through the auto-created singleton `WebARBridge.Instance`.

```csharp
using MakeGamesPlay.WebAR;

// Start from a bundled marker asset (preferred).
WebARBridge.Instance.Initialize(myMarker.data);

// Or from a hosted .mind URL (must be HTTPS).
WebARBridge.Instance.Initialize("https://example.com/target.mind");
```

## Tracking events

```csharp
// Target acquired / lost. The int is the target index (0 for single-target).
WebARBridge.Instance.TargetFound += index => { /* ... */ };
WebARBridge.Instance.TargetLost  += index => { /* ... */ };

// Per-frame pose. Args: target index, the 16-element column-major world-pose
// matrix, and that target's pose-constraint signal in degrees (low = well
// constrained; ~20° = unreliable; < 0 = unknown).
WebARBridge.Instance.MatrixUpdated += (index, matrix16, ambiguityDeg) => { /* ... */ };
```

> **Prefer the components over raw matrices.** `WebARImageTracker` already mirrors
> the *stabilised* world pose and toggles content visibility for you.
> `MatrixUpdated` delivers the **raw** tracker matrix, before the smoothing
> pipeline - use it only when you need the unfiltered pose.

## Lifecycle control

```csharp
// Surrender the camera (e.g. navigating to a non-AR view). Fires TrackerStopped
// once teardown finishes (async on iOS).
WebARBridge.Instance.Stop();
WebARBridge.Instance.TrackerStopped += reason => { /* clean up AR UI */ };

// Swap to a different marker mid-session (stop + re-init in the right order).
WebARBridge.Instance.Reinitialize(otherMarker.data);   // or (string url)

// Recover a stuck pose, lightest first:
WebARTrackedRoot.Instance.Recalibrate();        // hide + re-acquire
WebARBridge.Instance.SoftResetTracker();        // matcher reset, no camera drop
WebARBridge.Instance.RestartTracker();          // full rebuild
```

## Error handling

```csharp
// Subscribe BEFORE Initialize. The tracker will NOT start after this fires.
WebARBridge.Instance.UnsupportedBrowser += (capability, reason) => {
    // capability ∈ {"webgl2","float-textures","getusermedia","tracker-init",...}
    // reason is the user-facing copy already shown on the on-screen banner.
};
```

The same unsupported reason is shown on the on-screen banner automatically, so
you only need to subscribe if you want to react in Unity (hide content, show
your own panel).

## Useful state

```csharp
float hz       = WebARBridge.Instance.TrackerRateHz;     // smoothed tracker rate
bool tracking  = WebARBridge.Instance.IsTracking;        // between found and lost
int  active    = WebARBridge.Instance.ActiveTargetIndex; // current target
bool started   = WebARBridge.Instance.IsInitialized;     // a target was handed over
```

## Content visibility (per tracker)

```csharp
// The tracked root signals when the active target's content should show/hide.
WebARTrackedRoot.Instance.ContentVisibilityChanged += (targetIndex, visible) => { };
bool visible = WebARTrackedRoot.Instance.IsContentVisible;

// Hold content hidden behind your own loading / onboarding flow, then reveal.
WebARTrackedRoot.Instance.SetContentLocked(true);   // ... later: SetContentLocked(false)

// Programmatic tuning (mirrors the Inspector / on-device panel).
WebARTrackedRoot.Instance.SetTrackingStability(0.4f);
WebARTrackedRoot.Instance.SetViewingDistance(ViewingDistance.Close);
```

## Diagnostics

```csharp
// Toggle the on-screen overlay and verbose console logging at runtime.
WebARBridge.SetDiagnosticsVisible(true);
WebARBridge.SetVerboseLogging(true);

// Push your own key/value onto the on-device banner (no DevTools needed).
WebARBridge.SetDiagnostic("myValue", someValue.ToString());
```
