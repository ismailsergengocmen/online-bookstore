package bookstore.inventory;

import java.util.List;

public interface InventoryService {

    List<Inventory>  findAll();

    Inventory addItem(Inventory inventory);

    Inventory restockItem(Long inventoryId, Integer quantity, Double purchasePrice);

    void deleteItem(Long inventoryId);
}
