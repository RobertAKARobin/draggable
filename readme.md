Draggable

Makes stuff draggable, because who needs jQueryUI?

```
new DraggableContainer(someID, [overlapY, overlapX]);
```

- `someID` : `string` : The ID of an element, the children of which you want to become draggable.
- `overlapY` : `integer` : The amount a draggable element should be able to overlap the top and bottom borders of its parent. Defaults to 0.
- `overlapX` : `integer` : The amount a draggable element should be able to overlap the left and right borders of its parent. Defaults to 0.
